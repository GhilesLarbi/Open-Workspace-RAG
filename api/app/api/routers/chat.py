import json, uuid
from fastapi.responses import StreamingResponse
from fastapi import APIRouter
from app.api.dependencies.repositories import ChunkRepositoryDep
from app.api.dependencies.auth import PublicWorkspaceDep
from app.utils.vector import embed_chunks
from app.utils.text import get_language_enum
from app.utils.llm import stream_llm_generate, llm_generate, get_llm_prompt
from typing import List, Tuple
from app.schemas.chat import ChatDebugResponse, ChatResponse, AskRequest

router = APIRouter()


#################################################################################################
#################################################################################################
async def prepare_rag_data(
    request: AskRequest, 
    workspace_id: uuid.UUID, 
    chunk_repo: ChunkRepositoryDep
) -> Tuple[str | None, List[ChatDebugResponse]]:
    q_lang = get_language_enum(request.query)
    question_vector = embed_chunks([request.query])[0]

    db_scores, db_documents = await chunk_repo.search(
        workspace_id=workspace_id,
        lang=q_lang,
        question_vector=question_vector,
        limit=5, 
        tags=request.tags
    )
    
    if not db_documents:
        return None, []

    db_chunks = [c for d in db_documents for c in d.chunks]
    db_chunks.sort(key=lambda c: db_scores.get(c.id, 0.0), reverse=True)

    context_text = "\n\n".join([c.content for c in db_chunks])

    debug_output = []
    for db_document in db_documents:
        for db_chunk in db_document.chunks:
            db_chunk.db_score = db_scores.get(db_chunk.id, 0.0)                
        debug_doc = ChatDebugResponse.model_validate(db_document)
        debug_output.append(debug_doc)
    
    debug_output.sort(key=lambda d: max((c.db_score for c in d.chunks), default=0), reverse=True)

    prompt = get_llm_prompt(
        lang=q_lang,
        context_text=context_text,
        query=request.query
    )

    return prompt, debug_output

#################################################################################################
#################################################################################################
@router.post("/ask", response_model=ChatResponse, response_model_exclude_none=True)
async def ask_question(
    db_workspace: PublicWorkspaceDep,
    request: AskRequest,
    chunk_repo: ChunkRepositoryDep,
):
    prompt, debug_output = await prepare_rag_data(
        request=request, 
        workspace_id=db_workspace.id, 
        chunk_repo=chunk_repo
    )
    
    if not prompt:
        return {"content": "No info found.", "debug": [] if request.debug else None}

    response = await llm_generate(prompt=prompt)
    
    result = {"content": response['response']}
    if request.debug:
        result["debug"] = debug_output
        
    return result

#################################################################################################
#################################################################################################
@router.post("/ask/stream")
async def ask_question_stream(
    db_workspace: PublicWorkspaceDep,
    chunk_repo: ChunkRepositoryDep,
    request: AskRequest
):
    prompt, debug_output = await prepare_rag_data(
        request=request, 
        workspace_id=db_workspace.id, 
        chunk_repo=chunk_repo
    )

    async def event_generator():
        if request.debug:
            debug_payload = json.dumps({
                "debug": [debug.model_dump(mode="json") for debug in debug_output], 
                "content": ""
            })
            yield f"data: {debug_payload}\n\n"

        if not prompt:
            yield f"data: {json.dumps({'content': 'No info found.'})}\n\n"
            return

        async for chunk in stream_llm_generate(prompt=prompt):
            data = json.dumps({"content": chunk['response']})
            yield f"data: {data}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")