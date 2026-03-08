from fastapi import APIRouter, HTTPException, Query
from app.api.dependencies.repositories import WorkspaceRepositoryDep, DocumentRepositoryDep
from app.api.dependencies.auth import CurrentOrgDep

router = APIRouter()

#############################################################################
#############################################################################
@router.post("/{workspace_slug}")
async def add_tag(
    workspace_slug: str,
    db_org: CurrentOrgDep,
    workspace_repo: WorkspaceRepositoryDep,
    path: str = Query(...)
):
    db_workspace = await workspace_repo.get_by_slug_and_org(
        organization_id=db_org.id,
        slug=workspace_slug
    )
    if not db_workspace:
        raise HTTPException(404, "Workspace not found")
    
    await workspace_repo.add_tag(
        workspace_id=db_workspace.id,
        path=path
    )
    
    await workspace_repo.db.flush()
    await workspace_repo.db.refresh(db_workspace)
    await workspace_repo.db.commit()
    
    return {"tags": [str(t) for t in db_workspace.tags]}


#############################################################################
#############################################################################
@router.delete("/{workspace_slug}")
async def delete_tag(
    workspace_slug: str,
    db_org: CurrentOrgDep,
    workspace_repo: WorkspaceRepositoryDep,
    document_repo: DocumentRepositoryDep,
    path: str = Query(...)
):
    db_workspace = await workspace_repo.get_by_slug_and_org(
        organization_id=db_org.id,
        slug=workspace_slug
    )
    if not db_workspace:
        raise HTTPException(404, "Workspace not found")

    await workspace_repo.remove_tag_hierarchy(
        workspace_id=db_workspace.id,
        path=path
    )    
    await document_repo.bulk_remove_tag_hierarchy(
        workspace_id=db_workspace.id,
        path=path
    )
    
    await workspace_repo.db.commit()
    
    return {"status": "success"}


#############################################################################
#############################################################################
@router.patch("/{workspace_slug}")
async def rename_tag(
    workspace_slug: str,
    db_org: CurrentOrgDep,
    workspace_repo: WorkspaceRepositoryDep,
    document_repo: DocumentRepositoryDep,
    new_path: str = Query(...),
    old_path: str = Query(...),
):
    db_workspace = await workspace_repo.get_by_slug_and_org(
        organization_id=db_org.id,
        slug=workspace_slug
    )
    if not db_workspace:
        raise HTTPException(404, "Workspace not found")

    await workspace_repo.rename_tag_hierarchy(
        workspace_id=db_workspace.id,
        old_path=old_path,
        new_path=new_path
    )
    await document_repo.bulk_rename_tag_hierarchy(
        workspace_id=db_workspace.id,
        old_path=old_path,
        new_path=new_path
    )
    
    await workspace_repo.db.commit()
    
    return {"status": "success"}