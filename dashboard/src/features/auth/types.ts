export interface Organization {
  id: string
  name: string
  email: string
}

export interface Workspace {
  id: string
  organization_id: string
  name: string
  url: string
  slug: string
  api_key: string
  allowed_origins: string[]
  tags: string[]
}

export interface AuthResponse {
  access_token: string
  organization: Organization
}

export interface LoginInput {
  email: string
  password: string
}

export interface SignUpInput {
  name: string
  email: string
  password: string
}

export interface WorkspaceCreateInput {
  name: string
  url: string
  slug: string
  allowed_origins?: string[]
}

export interface WorkspaceUpdateInput {
  name?: string
  url?: string
  slug?: string
  allowed_origins?: string[]
  regenerate_api_key?: boolean
}
