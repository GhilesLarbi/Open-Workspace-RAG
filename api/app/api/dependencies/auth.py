from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_access_token
from app.api.dependencies.repositories import OrganizationRepositoryDep
from app.models.organization import Organization
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