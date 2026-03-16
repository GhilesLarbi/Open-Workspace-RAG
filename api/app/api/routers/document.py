# app/api/routes/document.py
from typing import List, Optional
from fastapi import APIRouter, Query
from app.api.dependencies.repositories import DocumentRepositoryDep
from app.api.dependencies.auth import CurrentOrgDep, CurrentWorkspaceDep
from app.schemas.document import DocumentResponse
import uuid

router = APIRouter()

#############################################################################
#############################################################################
@router.get("/{slug}", response_model=List[DocumentResponse])
async def get_documents(
    db_org: CurrentOrgDep,
    db_workspace: CurrentWorkspaceDep,
    document_repo: DocumentRepositoryDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    document_ids: Optional[List[uuid.UUID]] = Query(None)
):
    db_documents = await document_repo.get_all_with_chunks_by_workspace(
        workspace_id=db_workspace.id,
        skip=skip,
        limit=limit,
        document_ids=document_ids
    )
    
    return db_documents

#############################################################################
#############################################################################
@router.delete("/{slug}")
async def delete_documents(
    db_org: CurrentOrgDep,
    db_workspace: CurrentWorkspaceDep,
    document_repo: DocumentRepositoryDep,
    document_ids: List[uuid.UUID]
):
    await document_repo.delete_by_ids_and_workspace(document_ids, db_workspace.id)
    await document_repo.db.commit()
    return {"detail": "Documents deleted successfully"}

#############################################################################
#############################################################################
@router.patch("/{slug}/approval")
async def set_documents_approval(
    db_org: CurrentOrgDep,
    db_workspace: CurrentWorkspaceDep,
    document_repo: DocumentRepositoryDep,
    document_ids: List[uuid.UUID],
    is_approved: bool = Query(...)
):
    await document_repo.update_approval_status(document_ids, db_workspace.id, is_approved)
    await document_repo.db.commit()
    return {"detail": "Documents approval updated"}