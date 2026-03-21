import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, Play, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTableBulkActions } from '@/components/data-table'
import { useDeleteJobs, useRunJobs } from '../hooks'
import type { Job } from '../data/schema'

type JobsBulkActionsProps = {
  table: Table<Job>
}

export function JobsBulkActions({ table }: JobsBulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const deleteJobs = useDeleteJobs()
  const runJobs = useRunJobs()

  const handleBulkRun = () => {
    const ids = selectedRows.map((r) => r.original.id)
    toast.promise(runJobs.mutateAsync(ids), {
      loading: 'Re-running jobs...',
      success: () => {
        table.resetRowSelection()
        return `Re-run scheduled for ${ids.length} job${ids.length > 1 ? 's' : ''}`
      },
      error: 'Failed to re-run jobs',
    })
  }

  const handleBulkDelete = () => {
    const ids = selectedRows.map((r) => r.original.id)
    toast.promise(deleteJobs.mutateAsync(ids), {
      loading: 'Deleting jobs...',
      success: () => {
        table.resetRowSelection()
        setShowDeleteConfirm(false)
        return `Deleted ${ids.length} job${ids.length > 1 ? 's' : ''}`
      },
      error: 'Failed to delete jobs',
    })
  }

  return (
    <>
      <DataTableBulkActions table={table} entityName='job'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkRun}
              className='size-8'
              aria-label='Re-run selected jobs'
              title='Re-run selected'
              disabled={runJobs.isPending}
            >
              <Play />
              <span className='sr-only'>Re-run selected</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Re-run selected</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected jobs'
              title='Delete selected'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected</p>
          </TooltipContent>
        </Tooltip>
      </DataTableBulkActions>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        handleConfirm={handleBulkDelete}
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
          <>
            Are you sure you want to delete {selectedRows.length}{' '}
            {selectedRows.length > 1 ? 'jobs' : 'job'}? This action cannot be
            undone.
          </>
        }
        confirmText='Delete'
        destructive
      />
    </>
  )
}
