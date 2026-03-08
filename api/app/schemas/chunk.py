from pydantic import BaseModel, ConfigDict
from uuid import UUID

#############################################################################
#############################################################################
class ChunkResponse(BaseModel):
    id: UUID
    chunk_index: int
    content: str

    model_config = ConfigDict(from_attributes=True)