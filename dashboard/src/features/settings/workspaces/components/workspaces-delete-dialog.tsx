import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { workspaceApi } from '@/features/workspaces/workspace-api'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Input } from '@/components/ui/input'
import { useWorkspaceStore } from '@/stores/workspace-store'
import type { Workspace } from '@/features/workspaces/workspace-types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: Workspace
}

export function WorkspacesDeleteDialog({ open, onOpenChange, workspace }: Props) {
  const [confirm, setConfirm] = useState('')
  const navigate = useNavigate()
  const { workspaces, setWorkspaces, activeWorkspace, setActiveWorkspace } = useWorkspaceStore()

  const { mutate, isPending } = useMutation({
    mutationFn: () => workspaceApi.deleteWorkspace(workspace.slug),
    onSuccess: () => {
      const updatedList = workspaces.filter((w) => w.id !== workspace.id)
      setWorkspaces(updatedList)

      if (activeWorkspace?.id === workspace.id) {
        if (updatedList.length > 0) {
          setActiveWorkspace(updatedList[0])
        } else {
          setActiveWorkspace(null)
          navigate({ to: '/settings/workspaces' })
        }
      }

      toast.success('Workspace deleted')
      onOpenChange(false)
    },
    onError: (error: AxiosError<{ detail: string }>) => {
      toast.error(error.response?.data?.detail || 'Failed to delete workspace')
    },
  })

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      destructive
      title={`Delete ${workspace.name}?`}
      handleConfirm={() => mutate()}
      isLoading={isPending}
      disabled={confirm !== workspace.slug || isPending}
      desc={
        <div className='space-y-3'>
          <p>
            This action is permanent. Type <strong>{workspace.slug}</strong> to confirm.
          </p>
          <Input 
            autoFocus
            placeholder='Type slug to confirm'
            value={confirm} 
            onChange={(e) => setConfirm(e.target.value)} 
          />
        </div>
      }
    />
  )
}