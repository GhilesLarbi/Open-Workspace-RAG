import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN_KEY = 'access_token'
const CURRENT_WORKSPACE_KEY = 'current_workspace'

interface AuthState {
  accessToken: string
  currentWorkspaceSlug: string | null
  setAccessToken: (token: string) => void
  setCurrentWorkspaceSlug: (slug: string) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: getCookie(ACCESS_TOKEN_KEY) ?? '',
  currentWorkspaceSlug: getCookie(CURRENT_WORKSPACE_KEY) ?? null,
  setAccessToken: (token) => {
    setCookie(ACCESS_TOKEN_KEY, token)
    set({ accessToken: token })
  },
  setCurrentWorkspaceSlug: (slug) => {
    setCookie(CURRENT_WORKSPACE_KEY, slug)
    set({ currentWorkspaceSlug: slug })
  },
  reset: () => {
    removeCookie(ACCESS_TOKEN_KEY)
    removeCookie(CURRENT_WORKSPACE_KEY)
    set({ accessToken: '', currentWorkspaceSlug: null })
  },
}))
