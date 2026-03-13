import { apiClient } from '@/lib/api-client'
import type { 
  AuthResponse, 
  Organization, 
  RegisterRequest, 
  LoginRequest 
} from './auth-types'

export const authApi = {
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<AuthResponse>('/api/v1/organizations', {
      email: data.email,
      password: data.password,
      name: data.name,
    })
    return response.data
  },

  login: async (data: LoginRequest) => {
    const params = new URLSearchParams()
    params.append('username', data.email) 
    params.append('password', data.password)

    const response = await apiClient.post<AuthResponse>('/api/v1/organizations/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return response.data
  },

  getMe: async () => {
    const response = await apiClient.get<Organization>('/api/v1/organizations/me')
    return response.data
  }
}