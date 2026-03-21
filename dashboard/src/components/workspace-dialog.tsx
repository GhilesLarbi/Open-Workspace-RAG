import { useState } from 'react'
import { z } from 'zod'
import { useCreateWorkspace, useDeleteWorkspace, useUpdateWorkspace } from '@/features/auth/hooks'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Workspace } from '@/features/auth/types'

const workspaceFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().min(1, 'URL is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
})

export type WorkspaceFormData = z.infer<typeof workspaceFormSchema>

interface WorkspaceFormProps {
  workspace?: Workspace
  onSuccess?: () => void
  onCancel?: () => void
}

export function WorkspaceForm({ workspace, onSuccess, onCancel }: WorkspaceFormProps) {
  const [formData, setFormData] = useState<WorkspaceFormData>({
    name: workspace?.name ?? '',
    url: workspace?.url ?? '',
    slug: workspace?.slug ?? '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof WorkspaceFormData, string>>>({})

  const createWorkspace = useCreateWorkspace()
  const updateWorkspace = useUpdateWorkspace()
  const isEditing = !!workspace
  const isPending = createWorkspace.isPending || updateWorkspace.isPending

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = workspaceFormSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof WorkspaceFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof WorkspaceFormData
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})

    try {
      if (isEditing && workspace) {
        await updateWorkspace.mutateAsync({ slug: workspace.slug, data: result.data })
      } else {
        await createWorkspace.mutateAsync(result.data)
      }
      onSuccess?.()
    } catch {
      setErrors({ name: 'Operation failed. Please try again.' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='ws-name'>Name</Label>
        <Input
          id='ws-name'
          placeholder='My Workspace'
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
              slug: isEditing ? formData.slug : generateSlug(e.target.value),
            })
          }
        />
        {errors.name && <p className='text-sm text-destructive'>{errors.name}</p>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='ws-url'>URL</Label>
        <Input
          id='ws-url'
          placeholder='https://example.com'
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        />
        {errors.url && <p className='text-sm text-destructive'>{errors.url}</p>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='ws-slug'>Slug</Label>
        <Input
          id='ws-slug'
          placeholder='my-workspace'
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        />
        {errors.slug && <p className='text-sm text-destructive'>{errors.slug}</p>}
      </div>
      <DialogFooter>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function CreateWorkspaceDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const handleSuccess = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>Add a new workspace to your organization.</DialogDescription>
        </DialogHeader>
        <WorkspaceForm onSuccess={handleSuccess} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

export function EditWorkspaceDialog({
  workspace,
  open,
  onOpenChange,
}: {
  workspace: Workspace | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const handleSuccess = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
          <DialogDescription>Update the workspace details.</DialogDescription>
        </DialogHeader>
        {workspace && (
          <WorkspaceForm
            workspace={workspace}
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export function DeleteWorkspaceDialog({
  workspace,
  open,
  onOpenChange,
}: {
  workspace: Workspace | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const deleteWorkspace = useDeleteWorkspace()

  const handleDelete = async () => {
    if (!workspace) return
    await deleteWorkspace.mutateAsync(workspace.slug)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Workspace</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{workspace?.name}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete} disabled={deleteWorkspace.isPending}>
            {deleteWorkspace.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
