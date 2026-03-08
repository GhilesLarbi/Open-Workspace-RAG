from typing import List
from fastapi import APIRouter, HTTPException, status

from app.api.dependencies.repositories import WorkspaceRepositoryDep
from app.api.dependencies.auth import CurrentOrgDep
from app.schemas.workspace import (
    WorkspaceCreate, 
    WorkspaceResponse, 
    WorkspaceUpdate,
)

router = APIRouter()

#############################################################################
#############################################################################
@router.get("/", response_model=List[WorkspaceResponse])
async def get_workspaces(
    org: CurrentOrgDep,
    workspace_repo: WorkspaceRepositoryDep
):
    return await workspace_repo.get_all_by_org(org.id)

#############################################################################
#############################################################################
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=WorkspaceResponse)
async def create_workspace(
    data: WorkspaceCreate,
    org: CurrentOrgDep,
    workspace_repo: WorkspaceRepositoryDep
):
    existing = await workspace_repo.get_by_slug_and_org(data.slug, org.id)
    if existing:
        raise HTTPException(
            status_code=400, 
            detail=f"Workspace with slug '{data.slug}' already exists."
        )

    workspace = workspace_repo.create(
        organization_id=org.id,
        slug=data.slug,
        name=data.name,
        url=str(data.url)
    )
    await workspace_repo.db.commit()
    
    return workspace

#############################################################################
#############################################################################
@router.get("/{slug}", response_model=WorkspaceResponse)
async def get_workspace(
    slug: str,
    org: CurrentOrgDep,
    workspace_repo: WorkspaceRepositoryDep
):
    workspace = await workspace_repo.get_by_slug_and_org(slug, org.id)
    if not workspace:
        raise HTTPException(
            status_code=404, 
            detail="Workspace not found"
        )
    return workspace

#############################################################################
#############################################################################
@router.patch("/{slug}", response_model=WorkspaceResponse)
async def update_workspace(
    slug: str,
    data: WorkspaceUpdate,
    org: CurrentOrgDep,
    workspace_repo: WorkspaceRepositoryDep
):
    workspace = await workspace_repo.get_by_slug_and_org(slug, org.id)
    if not workspace:
        raise HTTPException(
            status_code=404, 
            detail="Workspace not found"
        )

    if data.slug and data.slug != slug:
        conflict = await workspace_repo.get_by_slug_and_org(data.slug, org.id)
        if conflict:
            raise HTTPException(
                status_code=400, 
                detail="Slug already taken"
            )
        workspace.slug = data.slug

    if data.name:
        workspace.name = data.name
    if data.url:
        workspace.url = str(data.url)

    await workspace_repo.db.commit()
    return workspace

#############################################################################
#############################################################################
@router.delete("/{slug}")
async def delete_workspace(
    slug: str,
    org: CurrentOrgDep,
    workspace_repo: WorkspaceRepositoryDep
):
    workspace = await workspace_repo.get_by_slug_and_org(slug, org.id)
    if not workspace:
        raise HTTPException(
            status_code=404, 
            detail="Workspace not found"
        )

    await workspace_repo.db.delete(workspace)
    await workspace_repo.db.commit()
    return {
        "status": "deleted",
        "info": f"Workspace '{workspace.name}' has been deleted."
    }