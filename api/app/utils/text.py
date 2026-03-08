import hashlib
from typing import List
from langdetect import detect
from app.models.enums import LanguageEnum

################################################################################
################################################################################
def get_language_enum(text: str) -> LanguageEnum:
    try:
        if not text: 
            return LanguageEnum.EN
        code = detect(text[:2000]).upper()
        return LanguageEnum[code] if code in LanguageEnum.__members__ else LanguageEnum.EN
    except Exception:
        return LanguageEnum.EN

################################################################################
################################################################################
def get_content_hash(text: str) -> str:
    return hashlib.md5(text.encode('utf-8')).hexdigest()

################################################################################
################################################################################
def chunk_text(text: str, max_chars: int = 2000) -> List[str]:
    """
    Splits text while preserving Markdown newlines and structure.
    """
    paragraphs = text.split('\n')
    chunks =[]
    current_chunk = ""
    
    for p in paragraphs:
        if len(current_chunk) + len(p) > max_chars and current_chunk:
            chunks.append(current_chunk.strip())
            current_chunk = ""
        
        current_chunk += p + "\n"
        
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
        
    return chunks