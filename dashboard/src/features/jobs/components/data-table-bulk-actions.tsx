import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { 
  Trash2, 
  // UserX, UserCheck, Mail 
} from 'lucide-react'
// import { toast } from 'sonner'
// import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
// import { type Job } from '../data/schema'
import { JobsMultiDeleteDialog } from './jobs-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  // const selectedRows = table.getFilteredSelectedRowModel().rows

  // const handleBulkStatusChange = (status: 'active' | 'inactive') => {
  //   const selectedJobs = selectedRows.map((row) => row.original as Job)
  //   toast.promise(sleep(2000), {
  //     loading: `${status === 'active' ? 'Activating' : 'Deactivating'} jobs...`,
  //     success: () => {
  //       table.resetRowSelection()
  //       return `${status === 'active' ? 'Activated' : 'Deactivated'} ${selectedJobs.length} job${selectedJobs.length > 1 ? 's' : ''}`
  //     },
  //     error: `Error ${status === 'active' ? 'activating' : 'deactivating'} jobs`,
  //   })
  //   table.resetRowSelection()
  // }

  // const handleBulkInvite = () => {
  //   const selectedJobs = selectedRows.map((row) => row.original as Job)
  //   toast.promise(sleep(2000), {
  //     loading: 'Notifying jobs...',
  //     success: () => {
  //       table.resetRowSelection()
  //       return `Notified ${selectedJobs.length} job${selectedJobs.length > 1 ? 's' : ''}`
  //     },
  //     error: 'Error notifying jobs',
  //   })
  //   table.resetRowSelection()
  // }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='job'>
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkInvite}
              className='size-8'
              aria-label='Notify selected jobs'
              title='Notify selected jobs'
            >
              <Mail />
              <span className='sr-only'>Notify selected jobs</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notify selected jobs</p>
          </TooltipContent>
        </Tooltip> */}

        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label='Activate selected jobs'
              title='Activate selected jobs'
            >
              <UserCheck />
              <span className='sr-only'>Activate selected jobs</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activate selected jobs</p>
          </TooltipContent>
        </Tooltip> */}

        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label='Deactivate selected jobs'
              title='Deactivate selected jobs'
            >
              <UserX />
              <span className='sr-only'>Deactivate selected jobs</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Deactivate selected jobs</p>
          </TooltipContent>
        </Tooltip> */}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected jobs'
              title='Delete selected jobs'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected jobs</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected jobs</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <JobsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}