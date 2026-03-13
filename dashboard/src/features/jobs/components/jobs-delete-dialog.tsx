'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Job } from '../data/schema'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { jobApi } from '../job-api'
import { useJobs } from './jobs-provider'

type JobsDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Job
}

export function JobsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: JobsDeleteDialogProps) {
  const [value, setValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  
  const { activeWorkspace } = useWorkspaceStore()
  const { fetchJobs } = useJobs()

  const handleDelete = async () => {
    if (value.trim() !== currentRow.id) return
    if (!activeWorkspace) {
      toast.error('No active workspace selected.')
      return
    }

    setIsDeleting(true)
    try {
      await jobApi.deleteJobs(activeWorkspace.slug,[currentRow.id])
      toast.success('Job deleted successfully')
      await fetchJobs()
      setValue('')
      onOpenChange(false)
    } catch (_error) {
      toast.error('Failed to delete job')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.id || isDeleting}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete Job
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-mono font-bold text-xs'>{currentRow.id}</span>?
            <br />
            This action will permanently remove the job with its configs
            from the system. This cannot be undone.
          </p>

          <Label className='my-2'>
            Job ID:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter Job ID to confirm deletion.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}