from pydantic import BaseModel, ConfigDict, Field, field_validator
from uuid import UUID
from typing import Optional, List

#############################################################################
#############################################################################
class WorkspaceCreate(BaseModel):
    name: str
    url: str
    slug: str

#############################################################################
#############################################################################
class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    slug: Optional[str] = None

#############################################################################
#############################################################################
class WorkspaceResponse(BaseModel):
    id: UUID
    organization_id: UUID
    name: str
    url: str
    slug: str
    tags: List[str] = []

    model_config = ConfigDict(from_attributes=True)

    @field_validator("tags", mode="before")
    @classmethod
    def transform_ltree_to_str(cls, v):
        if v is None:
            return []
        return [str(tag) for tag in v]