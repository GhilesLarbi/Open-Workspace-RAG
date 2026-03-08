from typing import List
from fastapi import APIRouter, HTTPException, Query

from app.api.dependencies.repositories import WorkspaceRepositoryDep, DocumentRepositoryDep
from app.api.dependencies.auth import CurrentOrgDep
from app.schemas.document import DocumentResponse
from app.background_tasks.sync import sync_site_task, sync_single_page_task

router = APIRouter()

#############################################################################
#############################################################################
@router.get("/{workspace_slug}", response_model=List[DocumentResponse])
async def get_documents(
    workspace_slug: str,
    db_org: CurrentOrgDep,
    workspace_repo: WorkspaceRepositoryDep,
    document_repo: DocumentRepositoryDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    db_workspace = await workspace_repo.get_by_slug_and_org(
        slug=workspace_slug, 
        organization_id=db_org.id
    )
    if not db_workspace:
        raise HTTPException(
            status_code=404, 
            detail="Workspace not found"
        )

    db_documents = await document_repo.get_all_with_chunks_by_workspace(
        workspace_id=db_workspace.id,
        skip=skip,
        limit=limit
    )
    
    return db_documents

#############################################################################
#############################################################################
@router.post("/{workspace_slug}")
async def add_single_document(
    workspace_slug: str,
    url: str,
    db_org: CurrentOrgDep,
    workspace_repo: WorkspaceRepositoryDep
):
    db_workspace = await workspace_repo.get_by_slug_and_org(
        slug=workspace_slug, 
        organization_id=db_org.id
    )
    if not db_workspace:
        raise HTTPException(
            status_code=404, 
            detail="Workspace not found"
        )

    task = await sync_single_page_task.kiq(
        workspace_id=str(db_workspace.id), 
        url=url
    )

    return {
        "status": "started",
        "task_id": task.task_id,
        "info": f"Scraping single URL: {url}"
    }

#############################################################################
#############################################################################
@router.post("/{workspace_slug}/scrape")
async def sync_workspace(
    workspace_slug: str,
    db_org: CurrentOrgDep,
    workspace_repo: WorkspaceRepositoryDep,
    max_pages: int = Query(1000, ge=1),
    depth: int = Query(10, ge=1)
):
    db_workspace = await workspace_repo.get_by_slug_and_org(
        slug=workspace_slug, 
        organization_id=db_org.id
    )
    if not db_workspace:
        raise HTTPException(
            status_code=404, 
            detail="Workspace not found"
        )

    task = await sync_site_task.kiq(
        workspace_id=str(db_workspace.id), 
        max_pages=max_pages,
        depth=depth
    )

    return {
        "status": "started",
        "task_id": task.task_id,
        "info": f"Crawling workspace: {db_workspace.name}"
    }