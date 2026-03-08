from typing import List
from app.core.embeddings import get_embedding_model

################################################################################
################################################################################
def embed_chunks(chunks_text: List[str]) -> List[List[float]]:
    if not chunks_text:
        return[]
        
    model = get_embedding_model()
    prefixed_chunks = [f"passage: {txt}" for txt in chunks_text]
    vectors = list(model.embed(prefixed_chunks))
    
    return [vec.tolist() for vec in vectors]