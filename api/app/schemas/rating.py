from pydantic import BaseModel, ConfigDict
from uuid import UUID
from typing import List
from datetime import datetime
from app.schemas.chat import SessionDebug


#############################################################################
#############################################################################
class RateRequest(BaseModel):
    session_id: UUID
    is_helpful: bool


#############################################################################
#############################################################################
class RatingResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    is_helpful: bool
    session: SessionDebug
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


#############################################################################
#############################################################################
class PaginatedRatingResponse(BaseModel):
    items: List[RatingResponse]
    total: int
    skip: int
    limit: int
