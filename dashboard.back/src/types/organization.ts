export interface Organization {
  id: string;
  name: string;
  email: string;
}

export interface OrganizationTokenResponse {
  access_token: string;
  organization: Organization;
}