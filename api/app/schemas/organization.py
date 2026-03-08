from pydantic import BaseModel, EmailStr, ConfigDict
from uuid import UUID

#############################################################################
#############################################################################
class OrganizationCreate(BaseModel):
    password: str
    name: str
    email: EmailStr


#############################################################################
#############################################################################
class OrganizationResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)

#############################################################################
#############################################################################
class OrganizationTokenResponse(BaseModel):
    access_token: str
    organization: OrganizationResponse