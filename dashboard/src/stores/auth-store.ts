import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import type { Organization } from '@/features/auth/auth-types'

const ACCESS_TOKEN_KEY = 'auth_token'

interface AuthState {
  auth: {
    organization: Organization | null
    accessToken: string
    setOrganization: (org: Organization | null) => void
    setAccessToken: (token: string) => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const initToken = getCookie(ACCESS_TOKEN_KEY) ? JSON.parse(getCookie(ACCESS_TOKEN_KEY)!) : ''

  return {
    auth: {
      organization: null,
      accessToken: initToken,
      setOrganization: (organization) =>
        set((state) => ({ ...state, auth: { ...state.auth, organization } })),
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN_KEY, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN_KEY)
          return { ...state, auth: { ...state.auth, organization: null, accessToken: '' } }
        }),
    },
  }
})