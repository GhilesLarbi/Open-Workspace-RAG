from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_access_token
from app.api.dependencies.repositories import OrganizationRepositoryDep, WorkspaceRepositoryDep
from app.models.organization import Organization
from app.models.workspace import Workspace
from typing import Annotated

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/organizations/login")

#############################################################################
#############################################################################
async def get_current_organization(
    repo: OrganizationRepositoryDep,
    token: str = Depends(oauth2_scheme)
) -> Organization:
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    org_id = decode_access_token(token)
    if not org_id:
        raise credentials_exception
        
    org = await repo.get_by_id(org_id)
    if not org:
        raise credentials_exception
        
    return org

CurrentOrgDep = Annotated[Organization, Depends(get_current_organization)]

#############################################################################
#############################################################################
async def get_current_workspace(
    db_org: CurrentOrgDep,
    repo: WorkspaceRepositoryDep,
    slug: str
) -> Organization:
    db_workspace = await repo.get_by_slug_and_org(
        slug=slug,
        organization_id=db_org.id
    )

    if not db_workspace:
        raise HTTPException(404, "Workspace not found")
         
    return db_workspace

CurrentWorkspaceDep = Annotated[Workspace, Depends(get_current_workspace)]
