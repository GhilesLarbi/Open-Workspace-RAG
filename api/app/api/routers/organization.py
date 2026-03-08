from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.dependencies.repositories import OrganizationRepositoryDep
from app.api.dependencies.auth import CurrentOrgDep
from app.schemas.organization import (
    OrganizationCreate, 
    OrganizationResponse, 
    OrganizationTokenResponse
)

router = APIRouter()

#############################################################################
#############################################################################
@router.post("/", response_model=OrganizationTokenResponse)
async def register_organization(
    data: OrganizationCreate, 
    organization_repo: OrganizationRepositoryDep
):
    if await organization_repo.get_by_email(data.email):
        raise HTTPException(
            status_code=400, 
            detail="Email already registered"
        )
    
    db_organization = organization_repo.create(
        email=data.email, 
        password_hash=get_password_hash(data.password), 
        name=data.name
    )
    await organization_repo.db.commit()
    
    access_token = create_access_token(subject=db_organization.id)
    
    return {
        "access_token": access_token, 
        "organization": db_organization
    }

#############################################################################
#############################################################################
@router.post("/login", response_model=OrganizationTokenResponse)
async def login(
    organization_repo: OrganizationRepositoryDep, 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    db_organization = await organization_repo.get_by_email(form_data.username) 
    if not db_organization: 
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Incorrect email or password"
        )
    
    if not verify_password(form_data.password, db_organization.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(subject=db_organization.id)
    
    return {
        "access_token": access_token, 
        "organization": db_organization
    }

#############################################################################
#############################################################################
@router.get("/me", response_model=OrganizationResponse)
async def get_my_organization(
    db_organization: CurrentOrgDep
):
    return db_organization

#############################################################################
#############################################################################
@router.delete("/")
async def delete_my_organization(
    org: CurrentOrgDep, 
    organization_repo: OrganizationRepositoryDep
):
    await organization_repo.delete(org)
    await organization_repo.db.commit()
    return {"message": "Organization deleted successfully"}