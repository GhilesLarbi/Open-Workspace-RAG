import uuid
from typing import List, Dict
from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import select

from app.api.dependencies.repositories import DocumentRepositoryDep
from app.api.dependencies.auth import CurrentWorkspaceDep
from app.models.document import Document

router = APIRouter()

#############################################################################
# Request Schemas
#############################################################################

class BulkLabelTestRequest(BaseModel):
    document_ids: List[uuid.UUID]

#############################################################################
# Test Endpoints
#############################################################################
@router.post("/test", response_model=List[Dict])
async def test_bulk_labeling(
    request: BulkLabelTestRequest,
    document_repository: DocumentRepositoryDep
):
    debug_log = await document_repository.bulk_label_documents_with_debug(
        document_ids=request.document_ids
    )
    await document_repository.db.commit()
    return debug_log