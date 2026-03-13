'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { jobApi } from '../job-api'
import { useJobs } from './jobs-provider'
import { type Job } from '../data/schema'

type JobMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function JobsMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: JobMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const[isDeleting, setIsDeleting] = useState(false)
  
  const { activeWorkspace } = useWorkspaceStore()
  const { fetchJobs } = useJobs()

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }
    
    if (!activeWorkspace) {
      toast.error('No active workspace selected.')
      return
    }

    // Extract IDs from the selected rows
    const jobIds = selectedRows.map((row) => (row.original as Job).id)

    setIsDeleting(true)
    try {
      await jobApi.deleteJobs(activeWorkspace.slug, jobIds)
      
      toast.success(
        `Deleted ${selectedRows.length} ${
          selectedRows.length > 1 ? 'jobs' : 'job'
        } successfully`
      )
      
      setValue('')
      table.resetRowSelection()
      await fetchJobs()
      onOpenChange(false)
    } catch (_error) {
      toast.error('Failed to delete jobs')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD || isDeleting}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete {selectedRows.length}{' '}
          {selectedRows.length > 1 ? 'jobs' : 'job'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete the selected jobs? <br />
            This action cannot be undone.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span className=''>Confirm by typing "{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
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