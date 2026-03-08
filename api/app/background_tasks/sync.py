import uuid
from datetime import datetime
from taskiq import TaskiqDepends
from sqlalchemy.ext.asyncio import AsyncSession

from app.taskiq.broker import broker
from app.core.database import get_db
from app.repositories.workspace import WorkspaceRepository
from app.repositories.document import DocumentRepository
from app.repositories.chunk import ChunkRepository

from app.utils.text import get_language_enum, get_content_hash, chunk_text
from app.utils.vector import embed_chunks
from app.utils.scraper import scrape_deep_crawl, scrape_single_page, extract_markdown

################################################################################
################################################################################
@broker.task
async def process_and_store_page_task(
    url: str,
    fit_markdown: str,
    title: str,
    workspace_id: str,
    db: AsyncSession = TaskiqDepends(get_db)
) -> dict:
    doc_repo = DocumentRepository(db)
    chunk_repo = ChunkRepository(db)
    
    content_hash = get_content_hash(fit_markdown)
    ws_uuid = uuid.UUID(workspace_id)
    existing_doc = await doc_repo.get_by_url_and_workspace(url, ws_uuid)
    
    if existing_doc:
        await chunk_repo.delete_by_document_id(existing_doc.id)
        existing_doc.content_hash = content_hash
        existing_doc.updated_at = datetime.now()
        existing_doc.title = title
        doc_id = existing_doc.id
    else:
        new_doc = doc_repo.create(
            workspace_id=ws_uuid,
            url=url,
            title=title or "Untitled",
            lang=get_language_enum(fit_markdown),
            content_hash=content_hash,
            tags=[], 
            suggestions=[]
        )
        await db.flush()
        doc_id = new_doc.id

    chunks_text = chunk_text(text=fit_markdown, max_chars=2000)
    
    if chunks_text:
        vectors = embed_chunks(chunks_text)
        chunks_data =[
            {"document_id": doc_id, "chunk_index": i, "content": txt, "embedding": vec}
            for i, (txt, vec) in enumerate(zip(chunks_text, vectors))
        ]
        chunk_repo.create_many(chunks_data)

    await db.commit()
    return {"status": "success", "url": url}

################################################################################
################################################################################
@broker.task
async def sync_single_page_task(
    workspace_id: str,
    url: str,
    db: AsyncSession = TaskiqDepends(get_db)
) -> dict:
    ws_repo = WorkspaceRepository(db)
    doc_repo = DocumentRepository(db)
    
    workspace = await ws_repo.get_by_id(workspace_id)
    if not workspace:
        return {"status": "error", "message": "Workspace not found"}

    result = await scrape_single_page(url)
    if not result.success or not result.html:
        return {"status": "error", "message": "Failed to scrape URL"}

    trafi_md = extract_markdown(result.html)
    if not trafi_md or len(trafi_md.strip()) < 300:
        return {"status": "ignored", "message": "Not enough content extracted"}

    content_hash = get_content_hash(trafi_md)
    existing_doc = await doc_repo.get_by_url_and_workspace(result.url, workspace.id)
    if existing_doc and existing_doc.content_hash == content_hash:
        return {"status": "skipped", "message": "Content unchanged"}

    meta = result.metadata or {}
    title = meta.get("title") or meta.get("og:title") or "Untitled"

    await process_and_store_page_task.kiq(
        url=result.url,
        fit_markdown=trafi_md,
        title=title,
        workspace_id=str(workspace.id)
    )

    return {"status": "success", "url": url}

################################################################################
################################################################################
@broker.task
async def sync_site_task(
    workspace_id: str,
    depth: int = 1, 
    max_pages: int = 20,
    db: AsyncSession = TaskiqDepends(get_db)
) -> dict:    
    ws_repo = WorkspaceRepository(db)
    doc_repo = DocumentRepository(db)
    
    workspace = await ws_repo.get_by_id(workspace_id)
    if not workspace:
        return {"status": "error", "message": "Workspace not found"}

    results = await scrape_deep_crawl(url=workspace.url, depth=depth, max_pages=max_pages)
    queued_urls = set()
    tasks_dispatched = 0

    for result in results:
        if not result.success or not result.html:
            continue
            
        normalized_url = result.url.rstrip('/')
        if normalized_url in queued_urls:
            continue

        trafi_md = extract_markdown(result.html)
        if not trafi_md or len(trafi_md.strip()) < 300:
            continue

        content_hash = get_content_hash(trafi_md)
        existing_doc = await doc_repo.get_by_url_and_workspace(result.url, workspace.id)
        if existing_doc and existing_doc.content_hash == content_hash:
            continue

        queued_urls.add(normalized_url)
        
        meta = result.metadata or {}
        title = meta.get("title") or meta.get("og:title") or "Untitled"

        await process_and_store_page_task.kiq(
            url=result.url,
            fit_markdown=trafi_md,
            title=title,
            workspace_id=str(workspace.id)
        )
        tasks_dispatched += 1

    return {
        "status": "success",
        "workspace_id": workspace_id,
        "results_found": len(results),
        "tasks_dispatched": tasks_dispatched
    }