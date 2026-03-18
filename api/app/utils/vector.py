from typing import List
from app.core.embeddings import get_embedding_model

################################################################################
################################################################################
def embed_chunks(texts: List[str], is_query: bool = False) -> List[List[float]]:
    if not texts:
        return []
        
    model = get_embedding_model()
    prefix = "query: " if is_query else "passage: "
    prefixed_texts = [f"{prefix}{txt}" for txt in texts]
    
    vectors = list(model.embed(prefixed_texts))
    return [vec.tolist() for vec in vectors]