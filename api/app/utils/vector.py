import ollama
from typing import List
from app.core.settings import settings

def embed_chunks(texts: List[str]) -> List[List[float]]:
    if not texts:
        return []

    client = ollama.Client(host=settings.OLLAMA_HOST)
    
    response = client.embed(
        model=settings.OLLAMA_EMBEDDING_MODEL,
        input=texts
    )
    
    return response['embeddings']