from pydantic import BaseModel, ConfigDict, field_validator
from uuid import UUID
from typing import List, Optional
from datetime import datetime

from app.schemas.enums import LanguageEnum
from app.schemas.chunk import ChunkResponse

#############################################################################
#############################################################################
class DocumentSuggestion(BaseModel):
    query: str
    answer: str
    rating: Optional[float] = None

#############################################################################
#############################################################################
class DocumentResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    is_approved: bool
    url: str
    title: Optional[str] = None
    lang: LanguageEnum
    tag: Optional[str] = None
    suggestions: List[DocumentSuggestion] = []
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

    @field_validator("tag", mode="before")
    @classmethod
    def transform_ltree_to_str(cls, v):
        if v is None:
            return None
        return str(v)


#############################################################################
#############################################################################
class DocumentResponseWithChunks(DocumentResponse):
    chunks: List[ChunkResponse]

#############################################################################
#############################################################################
class PaginatedDocumentResponse(BaseModel):
    items: List[DocumentResponse]
    total: int
    skip: int
    limit: int
    language_counts: Optional[dict[str, int]] = None
