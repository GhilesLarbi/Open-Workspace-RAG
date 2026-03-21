from pydantic import BaseModel, Field, ConfigDict, field_validator
from uuid import UUID
from typing import List, Optional
from datetime import datetime
from app.schemas.enums import LanguageEnum


#############################################################################
#############################################################################
class SessionChunk(BaseModel):
    id: UUID
    document_id: UUID
    content: str
    score: float
    
    model_config = ConfigDict(from_attributes=True)

class SessionTurn(BaseModel):
    query: str
    response: str
    chunks: List[SessionChunk] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.now)

class ChunkDebug(BaseModel):
    id: UUID
    chunk_index: int
    content: str
    score: Optional[float] = None
    model_config = ConfigDict(from_attributes=True)

class DocumentDebug(BaseModel):
    id: UUID
    workspace_id: UUID
    is_approved: bool
    url: str
    title: Optional[str] = None
    lang: LanguageEnum
    tags: List[str] = []
    suggestions: List[str] = []
    created_at: datetime
    updated_at: datetime
    chunks: List[ChunkDebug]
    model_config = ConfigDict(from_attributes=True)

    @field_validator("tags", mode="before")
    @classmethod
    def transform_ltree_to_str(cls, v):
        return [str(tag) for tag in v] if v else []

class SessionDebug(BaseModel):
    session_id: UUID
    workspace_id: UUID
    turns: List[SessionTurn] = Field(default_factory=list)

class ChatDebug(BaseModel):
    documents: List[DocumentDebug]
    session: SessionDebug

#############################################################################
#############################################################################
class AskRequest(BaseModel):
    query: str
    session_id: UUID
    tags: List[str] = Field(default_factory=list)
    debug: bool = False

#############################################################################
#############################################################################
class ChatResponse(BaseModel):
    content: str
    debug: Optional[ChatDebug] = None


#############################################################################
#############################################################################
class SessionTurnResponse(BaseModel):
    query: str
    response: str
    timestamp: datetime = Field(default_factory=datetime.now)

class SessionResponse(BaseModel):
    session_id: UUID
    workspace_id: UUID
    turns : List[SessionTurnResponse] = Field(default_factory=list)