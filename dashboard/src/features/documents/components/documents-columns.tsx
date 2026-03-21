import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { languages, approvalStatuses } from '../data/data'
import { type Document } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { cn } from '@/lib/utils'

export const documentsColumns: ColumnDef<Document>[] = [
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
    cell: ({ row }) => <div className='w-[80px] truncate text-xs font-mono'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    meta: {
      className: 'ps-1 max-w-[250px]',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      const title = row.original.title || row.original.url
      return (
        <div className='flex flex-col max-w-full'>
          <span className='truncate font-medium'>{title}</span>
          <span className='truncate text-xs text-muted-foreground font-mono'>{row.original.url}</span>
        </div>
      )
    },
  },
{
    accessorKey: 'is_approved',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Approval' />
    ),
    meta: { className: 'ps-1 w-[100px]', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const isApproved = Boolean(row.getValue('is_approved'))
      const status = approvalStatuses.find(s => s.value === String(isApproved))
      
      if (!status) return null
      
      const Icon = status.icon
      
      return (
        <div className='flex items-center gap-2'>
          <Icon className={cn(
            "size-4 shrink-0",
            isApproved ? "text-primary" : "text-destructive"
          )} />
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: () => true,
  },
  {
    accessorKey: 'lang',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Language' />
    ),
    meta: { className: 'ps-1 w-[100px]', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const lang = languages.find(
        (l) => l.value === row.getValue('lang')
      )

      if (!lang) return null

      return (
        <div className='flex items-center gap-2'>
          <span>{lang.label}</span>
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
    meta: { className: 'w-[160px]' },
    cell: ({ row }) => {
      return <div className='text-xs'>{new Date(row.getValue('created_at')).toLocaleString()}</div>
    },
  },
  {
    id: 'job_ids',
    accessorKey: 'job_ids',
    header: () => null,
    cell: () => null,
    enableHiding: true,
    filterFn: () => true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
