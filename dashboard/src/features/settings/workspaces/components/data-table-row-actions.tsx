import type { Row } from '@tanstack/react-table'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useWorkspaces } from '../workspaces-context'
import type { Workspace } from '@/features/workspaces/workspace-types'

interface DataTableRowActionsProps {
  row: Row<Workspace>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useWorkspaces()
  
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => { 
          setCurrentRow(row.original); 
          setOpen('update') 
        }}>
          <Edit className='mr-2 h-4 w-4' /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className='text-destructive focus:bg-destructive/10 focus:text-destructive' 
          onClick={() => { 
            setCurrentRow(row.original); 
            setOpen('delete') 
          }}
        >
          <Trash2 className='mr-2 h-4 w-4' /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}