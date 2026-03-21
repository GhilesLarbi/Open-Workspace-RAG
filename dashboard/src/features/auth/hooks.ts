import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { authApi } from './api'
import type { LoginInput, SignUpInput, Workspace, WorkspaceCreateInput, WorkspaceUpdateInput } from './types'

export const ME_QUERY_KEY = ['organization', 'me'] as const
export const WORKSPACES_QUERY_KEY = ['workspaces'] as const

export function useMe() {
  const { accessToken } = useAuthStore()
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: authApi.getMe,
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  })
}

export function useWorkspaces() {
  const { accessToken } = useAuthStore()
  return useQuery({
    queryKey: WORKSPACES_QUERY_KEY,
    queryFn: authApi.getWorkspaces,
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCurrentWorkspace() {
  const { currentWorkspaceSlug } = useAuthStore()
  const { data: workspaces } = useWorkspaces()

  const workspace = workspaces?.find((w) => w.slug === currentWorkspaceSlug) ?? workspaces?.[0]

  const setCurrentWorkspace = useCallback(
    (ws: Workspace) => {
      useAuthStore.getState().setCurrentWorkspaceSlug(ws.slug)
    },
    [],
  )

  return {
    workspace,
    workspaces: workspaces ?? [],
    setCurrentWorkspace,
    isLoading: !workspaces,
  }
}

export function useLogin() {
  const { setAccessToken } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: ({ access_token, organization }) => {
      setAccessToken(access_token)
      queryClient.setQueryData(ME_QUERY_KEY, organization)
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: WORKSPACES_QUERY_KEY })
        navigate({ to: '/' })
      }
    },
  })
}

export function useSignUp() {
  const { setAccessToken } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SignUpInput) => authApi.signUp(data),
    onSuccess: ({ access_token, organization }) => {
      setAccessToken(access_token)
      queryClient.setQueryData(ME_QUERY_KEY, organization)
    },
    onSettled: (data) => {
      if (data) navigate({ to: '/' })
    },
  })
}

export function useLogout() {
  const { reset } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return () => {
    reset()
    queryClient.clear()
    navigate({ to: '/sign-in' })
  }
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient()
  const { setCurrentWorkspaceSlug } = useAuthStore()

  return useMutation({
    mutationFn: (data: WorkspaceCreateInput) => authApi.createWorkspace(data),
    onSuccess: (workspace) => {
      queryClient.setQueryData<Workspace[]>(WORKSPACES_QUERY_KEY, (old) => {
        if (!old) return [workspace]
        return [...old, workspace]
      })
      setCurrentWorkspaceSlug(workspace.slug)
    },
  })
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: WorkspaceUpdateInput }) =>
      authApi.updateWorkspace(slug, data),
    onSuccess: (updatedWorkspace) => {
      queryClient.setQueryData<Workspace[]>(WORKSPACES_QUERY_KEY, (old) => {
        if (!old) return [updatedWorkspace]
        return old.map((ws) => (ws.id === updatedWorkspace.id ? updatedWorkspace : ws))
      })
    },
  })
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient()
  const { currentWorkspaceSlug, setCurrentWorkspaceSlug } = useAuthStore()

  return useMutation({
    mutationFn: (slug: string) => authApi.deleteWorkspace(slug),
    onSuccess: (_, deletedSlug) => {
      queryClient.setQueryData<Workspace[]>(WORKSPACES_QUERY_KEY, (old) => {
        if (!old) return []
        return old.filter((ws) => ws.slug !== deletedSlug)
      })
      if (currentWorkspaceSlug === deletedSlug) {
        const workspaces = queryClient.getQueryData<Workspace[]>(WORKSPACES_QUERY_KEY)
        const firstWorkspace = workspaces?.[0]
        if (firstWorkspace) {
          setCurrentWorkspaceSlug(firstWorkspace.slug)
        } else {
          setCurrentWorkspaceSlug('')
        }
      }
    },
  })
}
