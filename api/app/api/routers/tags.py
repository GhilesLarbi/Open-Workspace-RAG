from fastapi import APIRouter, Query
from app.api.dependencies.repositories import WorkspaceRepositoryDep, DocumentRepositoryDep
from app.api.dependencies.auth import CurrentOrgDep, CurrentWorkspaceDep
from app.utils.vector import embed_chunks
from typing import List

router = APIRouter()


#############################################################################
#############################################################################
@router.get("/{slug}")
async def get_tags(
    db_org: CurrentOrgDep,
    db_workspace: CurrentWorkspaceDep,
    workspace_repo: WorkspaceRepositoryDep
):
    tags = await workspace_repo.get_tags(workspace_id=db_workspace.id)
    return tags

#############################################################################
#############################################################################
@router.post("/{slug}", response_model=List[str])
async def add_tag(
    db_org: CurrentOrgDep,
    db_workspace: CurrentWorkspaceDep,
    workspace_repo: WorkspaceRepositoryDep,
    path: str = Query(..., pattern=r"^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*$")
):
    parts = path.split(".")
    ancestors = [".".join(parts[:i+1]) for i in range(len(parts))]
    vectors = embed_chunks([p.replace(".", " ") for p in ancestors], is_query=True)
    embeddings_map = {p: v for p, v in zip(ancestors, vectors)}

    updated_tags = await workspace_repo.sync_tags_and_embeddings(
        workspace_id=db_workspace.id,
        tags=ancestors,
        embeddings=embeddings_map
    )
    
    await workspace_repo.db.commit()
    
    return updated_tags

#############################################################################
#############################################################################
@router.delete("/{slug}", response_model=List[str])
async def delete_tag(
    db_org: CurrentOrgDep,
    db_workspace: CurrentWorkspaceDep,
    workspace_repo: WorkspaceRepositoryDep,
    document_repo: DocumentRepositoryDep,
    path: str = Query(
        ..., 
        pattern=r"^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*$",
    )
):
    updated_tags = await workspace_repo.remove_tag_hierarchy(
        workspace_id=db_workspace.id,
        path=path
    )    
    
    await document_repo.bulk_remove_tag_hierarchy(
        workspace_id=db_workspace.id,
        path=path
    )
    
    await workspace_repo.db.commit()
    
    return updated_tags

#############################################################################
#############################################################################
@router.patch("/{slug}", response_model=List[str])
async def rename_tag(
    db_org: CurrentOrgDep,
    db_workspace: CurrentWorkspaceDep,
    workspace_repo: WorkspaceRepositoryDep,
    document_repo: DocumentRepositoryDep,
    new_path: str = Query(..., pattern=r"^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*$"),
    old_path: str = Query(..., pattern=r"^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*$"),
):
    current_tags = await workspace_repo.get_tags(db_workspace.id)
    
    affected_old_paths = [t for t in current_tags if t == old_path or t.startswith(f"{old_path}.")]
    if not affected_old_paths:
        return current_tags

    affected_new_paths = [t.replace(old_path, new_path, 1) for t in affected_old_paths]
    
    new_parts = new_path.split(".")
    all_new_ancestors = [".".join(new_parts[:i+1]) for i in range(len(new_parts))]
    
    missing_ancestors = [p for p in all_new_ancestors if p not in current_tags and p not in affected_new_paths]
    
    paths_to_embed = list(set(affected_new_paths + missing_ancestors))
    vectors = embed_chunks([p.replace(".", " ") for p in paths_to_embed], is_query=True)
    new_embeddings_map = {p: v for p, v in zip(paths_to_embed, vectors)}

    updated_tags = await workspace_repo.rename_sync_hierarchy(
        workspace_id=db_workspace.id,
        old_path=old_path,
        new_path=new_path,
        new_ancestors=all_new_ancestors,
        new_branch_embeddings=new_embeddings_map
    )
    
    # 7. Bulk Document Update
    await document_repo.bulk_rename_tag_hierarchy(
        workspace_id=db_workspace.id,
        old_path=old_path,
        new_path=new_path
    )
    
    await workspace_repo.db.commit()
    return updated_tags