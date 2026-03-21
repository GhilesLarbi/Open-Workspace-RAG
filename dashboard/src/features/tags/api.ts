import apiClient from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'

const getSlug = () => {
  const { currentWorkspaceSlug } = useAuthStore.getState()
  if (!currentWorkspaceSlug) throw new Error('No workspace selected')
  return currentWorkspaceSlug
}

export const tagsApi = {
  list: async (): Promise<string[]> => {
    const slug = getSlug()
    return apiClient.get(`/tags/${slug}`).then((r) => r.data)
  },

  add: async (path: string): Promise<string[]> => {
    const slug = getSlug()
    return apiClient.post(`/tags/${slug}?path=${path}`).then((r) => r.data)
  },

  delete: async (path: string): Promise<string[]> => {
    const slug = getSlug()
    return apiClient.delete(`/tags/${slug}?path=${path}`).then((r) => r.data)
  },

  rename: async (oldPath: string, newPath: string): Promise<string[]> => {
    const slug = getSlug()
    return apiClient.patch(`/tags/${slug}?old_path=${oldPath}&new_path=${newPath}`).then((r) => r.data)
  },
}
