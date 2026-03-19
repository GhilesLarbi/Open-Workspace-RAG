from app.schemas.enums import LanguageEnum
from ollama import AsyncClient
from typing import AsyncGenerator, Dict, Any
from app.core.settings import settings



LLM_OPTIONS = {
    "temperature": 0,
    "num_thread": 8,
    "num_ctx": 4096,
    "num_batch": 512
}


#######################################################################
#######################################################################
async def stream_llm_generate(prompt: str) -> AsyncGenerator[Dict[str, Any], None]:
    client = AsyncClient(host=settings.OLLAMA_HOST)    
    async for chunk in await client.generate(
        model=settings.OLLAMA_LLM_MODEL, 
        prompt=prompt,
        options=LLM_OPTIONS,
        stream=True 
    ):
        yield chunk

#######################################################################
#######################################################################
async def llm_generate(prompt: str) -> Dict[str, Any]:
    client = AsyncClient(host=settings.OLLAMA_HOST)
    return await client.generate(
        model=settings.OLLAMA_LLM_MODEL, 
        prompt=prompt,
        options=LLM_OPTIONS,
        stream=False
    )


#######################################################################
#######################################################################
def get_llm_prompt(lang: LanguageEnum, context_text: str, query: str) -> str:
    prompts = {
        LanguageEnum.EN: f"""
Answer the question based on the text below. 
If the answer isn't in the text, say you don't know.

Text:
{context_text}

Question: {query}

Answer:
""",
        LanguageEnum.FR: f"""
Répondez à la question en vous basant sur le texte ci-dessous. 
Si la réponse n'est pas dans le texte, dites que vous ne savez pas.

Texte :
{context_text}

Question : {query}

Réponse :
""",
        LanguageEnum.AR: f"""
أجب على السؤال بناءً على النص أدناه. 
إذا لم تكن الإجابة موجودة في النص، قل أنك لا تعرف.

النص:
{context_text}

السؤال: {query}

الإجابة:
"""
    }
    
    return prompts.get(lang, prompts[LanguageEnum.EN]).strip()