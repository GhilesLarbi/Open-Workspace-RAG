import hashlib
from typing import List
from langdetect import detect
from app.schemas.enums import LanguageEnum
from crawl4ai.chunking_strategy import SlidingWindowChunking


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
def chunk_text(text: str, window_size: int = 400, overlap: int = 50) -> List[str]:
    if not text or not text.strip():
        return []

    step = max(1, window_size - overlap)

    chunker = SlidingWindowChunking(
        window_size=window_size,
        step=step
    )
    
    return chunker.chunk(text)