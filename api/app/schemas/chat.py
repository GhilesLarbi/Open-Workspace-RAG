from pydantic import BaseModel, Field, ConfigDict, field_validator
from uuid import UUID
from typing import List, Optional
from datetime import datetime
from app.schemas.enums import LanguageEnum


#############################################################################
#############################################################################
class ChunkDebugResponse(BaseModel):
    id: UUID
    chunk_index: int
    content: str
    db_score: Optional[float] = None
    
    model_config = ConfigDict(from_attributes=True)

#############################################################################
#############################################################################
class ChatDebugResponse(BaseModel):
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

    chunks: List[ChunkDebugResponse]

    model_config = ConfigDict(from_attributes=True)

    @field_validator("tags", mode="before")
    @classmethod
    def transform_ltree_to_str(cls, v):
        if v is None:
            return[]
        return [str(tag) for tag in v]



#############################################################################
#############################################################################
class AskRequest(BaseModel):
    query: str
    tags: List[str] = Field(default_factory=list)
    debug: bool = False

#############################################################################
#############################################################################
class ChatResponse(BaseModel):
    content: str
    debug: Optional[List[ChatDebugResponse]] = None