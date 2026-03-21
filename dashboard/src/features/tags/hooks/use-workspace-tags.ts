import { useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCurrentWorkspace, WORKSPACES_QUERY_KEY } from '@/features/auth/hooks'
import { tagsApi } from '../api'

export function useWorkspaceTags() {
  const queryClient = useQueryClient()
  const { workspace, isLoading } = useCurrentWorkspace()

  const tags = useMemo(() => workspace?.tags ?? [], [workspace])
  

  const addTag = useMutation({
    mutationFn: (path: string) => tagsApi.add(path),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: WORKSPACES_QUERY_KEY })
    },
  })

  const deleteTag = useMutation({
    mutationFn: (path: string) => tagsApi.delete(path),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: WORKSPACES_QUERY_KEY })
    },
  })

  const renameTag = useMutation({
    mutationFn: ({ oldPath, newPath }: { oldPath: string; newPath: string }) =>
      tagsApi.rename(oldPath, newPath),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: WORKSPACES_QUERY_KEY })
    },
  })

  return {
    tags,
    isLoading,
    addTag,
    deleteTag,
    renameTag,
  }
}