// src/features/workspaces/workspace-api.ts
import { apiClient } from '@/lib/api-client'
import type { Workspace, WorkspaceCreate, WorkspaceUpdate } from './workspace-types'

export const workspaceApi = {
  // GET / - Get all workspaces for the current org
  getWorkspaces: async () => {
    const response = await apiClient.get<Workspace[]>('/api/v1/workspaces/')
    return response.data
  },

  // POST / - Create a new workspace
  createWorkspace: async (data: WorkspaceCreate) => {
    const response = await apiClient.post<Workspace>('/api/v1/workspaces/', data)
    return response.data
  },

  // PATCH /{slug} - Update workspace
  updateWorkspace: async (slug: string, data: WorkspaceUpdate) => {
    const response = await apiClient.patch<Workspace>(`/api/v1/workspaces/${slug}`, data)
    return response.data
  },

  // DELETE /{slug}
  deleteWorkspace: async (slug: string) => {
    const response = await apiClient.delete(`/api/v1/workspaces/${slug}`)
    return response.data
  }
}