import type { ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from 'lucide-react'
import type { Workspace } from '@/features/workspaces/workspace-types'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Workspace>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span className='font-medium'>{row.getValue('name')}</span>,
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => (
      <code className='rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase'>
        {row.getValue('slug')}
      </code>
    ),
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => (
      <div className='flex items-center gap-2 text-muted-foreground'>
        <span className='truncate max-w-[250px]'>{row.getValue('url')}</span>
        <a 
          href={row.getValue('url')} 
          target='_blank' 
          rel='noreferrer' 
          className='hover:text-primary'
        >
          <ExternalLink size={14} />
        </a>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]