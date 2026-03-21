import apiClient from '@/lib/api-client'
import type {
  AuthResponse,
  LoginInput,
  Organization,
  SignUpInput,
  Workspace,
  WorkspaceCreateInput,
  WorkspaceUpdateInput,
} from './types'

const LOGIN_HEADERS = { 'Content-Type': 'application/x-www-form-urlencoded' }

export const authApi = {
  login: (data: LoginInput): Promise<AuthResponse> =>
    apiClient
      .post(
        '/organizations/login',
        new URLSearchParams({ username: data.email, password: data.password }),
        { headers: LOGIN_HEADERS },
      )
      .then((r) => r.data),

  signUp: (data: SignUpInput): Promise<AuthResponse> =>
    apiClient.post('/organizations/', data).then((r) => r.data),

  getMe: (): Promise<Organization> =>
    apiClient.get('/organizations/me').then((r) => r.data),

  getWorkspaces: (): Promise<Workspace[]> =>
    apiClient.get('/workspaces/').then((r) => r.data),

  getWorkspace: (slug: string): Promise<Workspace> =>
    apiClient.get(`/workspaces/${slug}`).then((r) => r.data),

  createWorkspace: (data: WorkspaceCreateInput): Promise<Workspace> =>
    apiClient.post('/workspaces/', data).then((r) => r.data),

  updateWorkspace: (slug: string, data: WorkspaceUpdateInput): Promise<Workspace> =>
    apiClient.patch(`/workspaces/${slug}`, data).then((r) => r.data),

  deleteWorkspace: (slug: string): Promise<void> =>
    apiClient.delete(`/workspaces/${slug}`).then((r) => r.data),
}
