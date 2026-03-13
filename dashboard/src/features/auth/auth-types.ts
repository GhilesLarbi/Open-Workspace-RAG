export interface Organization {
  id: string
  email: string
  name: string
}

export interface AuthResponse {
  access_token: string
  organization: Organization
}

export interface RegisterRequest {
  email: string
  name: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}