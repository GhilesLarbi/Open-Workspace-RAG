import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { jobStatuses } from '../data/data'
import type { Job } from '../data/schema'
import { JobsRowActions } from './row-actions'

export const jobsColumns: ColumnDef<Job>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <div className='w-[100px] truncate font-mono text-xs'>
        {row.getValue('id')}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'config.url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='URL' />
    ),
    meta: {
      className: 'ps-1 w-1/2 max-w-[250px]',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      const url = row.original.config?.url
      if (!url) return <span className='text-muted-foreground'>—</span>
      return (
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='block truncate font-medium hover:underline'
          onClick={(e) => e.stopPropagation()}
        >
          {url}
        </a>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const status = jobStatuses.find((s) => s.value === row.getValue('status'))
      if (!status) return null
      return (
        <div className='flex w-[100px] items-center gap-2'>
          {status.icon && (
            <status.icon className='size-4 text-muted-foreground' />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: () => true,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div className='w-[140px] text-sm'>
          {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <JobsRowActions row={row} />,
  },
]
