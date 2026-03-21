import { Globe, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useCurrentWorkspace, useWorkspaces } from '@/features/auth/hooks'
import { CreateWorkspaceDialog, DeleteWorkspaceDialog, EditWorkspaceDialog } from '@/components/workspace-dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { Workspace } from '@/features/auth/types'

interface WorkspaceRowProps {
  workspace: Workspace
  isCurrent: boolean
  onEdit: (workspace: Workspace) => void
  onDelete: (workspace: Workspace) => void
}

function WorkspaceRow({ workspace, isCurrent, onEdit, onDelete }: WorkspaceRowProps) {
  return (
    <TableRow>
      <TableCell className='flex items-center gap-3'>
        <div className='flex size-8 items-center justify-center rounded-lg bg-muted'>
          <Globe className='size-4' />
        </div>
        <div className='flex flex-col'>
          <span className='font-medium'>{workspace.name}</span>
          <span className='text-xs text-muted-foreground'>{workspace.url}</span>
        </div>
      </TableCell>
      <TableCell>
        <code className='text-xs text-muted-foreground'>{workspace.slug}</code>
      </TableCell>
      <TableCell>{isCurrent && <Badge variant='secondary'>Active</Badge>}</TableCell>
      <TableCell className='text-right'>
        <div className='flex items-center justify-end gap-2'>
          <Button variant='ghost' size='icon' onClick={() => onEdit(workspace)}>
            <Pencil className='size-4' />
          </Button>
          <Button variant='ghost' size='icon' onClick={() => onDelete(workspace)} disabled={isCurrent}>
            <Trash2 className='size-4' />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function WorkspacesTable() {
  const { data: workspaces, isLoading } = useWorkspaces()
  const { workspace: currentWorkspace } = useCurrentWorkspace()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editWorkspace, setEditWorkspace] = useState<Workspace | null>(null)
  const [deleteWorkspace, setDeleteWorkspace] = useState<Workspace | null>(null)

  if (isLoading) {
    return <div className='text-center py-8 text-muted-foreground'>Loading...</div>
  }

  return (
    <>
      <div className='mb-4 flex justify-end'>
        <Button onClick={() => setCreateDialogOpen(true)}>Create Workspace</Button>
      </div>

      <CreateWorkspaceDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[300px]'>Workspace</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className='w-[100px]'>Status</TableHead>
              <TableHead className='w-[100px] text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workspaces?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className='text-center py-8 text-muted-foreground'>
                  No workspaces found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
            {workspaces?.map((ws) => (
              <WorkspaceRow
                key={ws.id}
                workspace={ws}
                isCurrent={currentWorkspace?.id === ws.id}
                onEdit={setEditWorkspace}
                onDelete={setDeleteWorkspace}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <EditWorkspaceDialog
        workspace={editWorkspace}
        open={!!editWorkspace}
        onOpenChange={(open) => !open && setEditWorkspace(null)}
      />

      <DeleteWorkspaceDialog
        workspace={deleteWorkspace}
        open={!!deleteWorkspace}
        onOpenChange={(open) => !open && setDeleteWorkspace(null)}
      />
    </>
  )
}
