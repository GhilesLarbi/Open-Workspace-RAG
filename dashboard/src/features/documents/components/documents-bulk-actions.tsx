import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type Document } from '../data/schema'
import { useUpdateDocumentsApproval } from '../hooks'
import { DocumentsMultiDeleteDialog } from './documents-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const updateApproval = useUpdateDocumentsApproval()

  const handleBulkApproval = async (isApproved: boolean) => {
    const documentIds = selectedRows.map((row) => (row.original as Document).id)
    
    toast.promise(updateApproval.mutateAsync({ documentIds, isApproved }), {
      loading: isApproved ? 'Approving documents...' : 'Revoking approvals...',
      success: () => {
        table.resetRowSelection()
        return `${documentIds.length} document${documentIds.length > 1 ? 's' : ''} ${isApproved ? 'approved' : 'revoked'}.`
      },
      error: 'Failed to update approval status',
    })
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='document'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='size-8'
              onClick={() => handleBulkApproval(true)}
              aria-label='Approve selected'
              title='Approve selected'
            >
              <CheckCircle className='text-primary' />
              <span className='sr-only'>Approve selected</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Approve selected</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='size-8'
              onClick={() => handleBulkApproval(false)}
              aria-label='Revoke selected'
              title='Revoke selected'
            >
              <XCircle className='text-destructive' />
              <span className='sr-only'>Revoke selected</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Revoke selected</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected'
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
      </BulkActionsToolbar>

      <DocumentsMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
