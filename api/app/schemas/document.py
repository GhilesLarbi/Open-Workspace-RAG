from pydantic import BaseModel, ConfigDict, field_validator
from uuid import UUID
from typing import List, Optional
from datetime import datetime

from app.models.enums import LanguageEnum
from app.schemas.chunk import ChunkResponse

#############################################################################
#############################################################################
class DocumentResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    is_approved: bool
    url: str
    title: Optional[str] = None
    lang: LanguageEnum
    tags: List[str] =[]
    suggestions: List[str] =[]
    created_at: datetime
    updated_at: datetime
    
    chunks: List[ChunkResponse] =[]

    model_config = ConfigDict(from_attributes=True)

    @field_validator("tags", mode="before")
    @classmethod
    def transform_ltree_to_str(cls, v):
        if v is None:
            return[]
        return [str(tag) for tag in v]