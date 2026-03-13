import { useNavigate } from '@tanstack/react-router'
import { ChevronsUpDown, Plus, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWorkspaceStore } from '@/stores/workspace-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function WorkspaceSwitcher() {
  const navigate = useNavigate()
  const { isMobile } = useSidebar()
  const { workspaces, activeWorkspace, setActiveWorkspace } = useWorkspaceStore()

  const activeIndex = workspaces.findIndex((w) => w.id === activeWorkspace?.id)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div 
                className={cn(
                  'flex aspect-square size-8 items-center justify-center rounded-lg text-[10px] font-bold text-white uppercase shadow-sm border border-sidebar-border shrink-0',
                  activeWorkspace 
                    ? (activeIndex % 5 === 0 ? 'bg-chart-1' : 
                       activeIndex % 5 === 1 ? 'bg-chart-2' :
                       activeIndex % 5 === 2 ? 'bg-chart-3' :
                       activeIndex % 5 === 3 ? 'bg-chart-4' : 'bg-chart-5')
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {activeWorkspace ? activeWorkspace.slug.slice(0, 3) : <Building2 size={16} />}
              </div>

              <div className='grid flex-1 text-start text-sm leading-tight ml-2'>
                <span className='truncate font-semibold'>
                  {activeWorkspace?.name || 'No Workspace'}
                </span>
                <span className='truncate text-xs text-muted-foreground'>
                  {activeWorkspace?.url || 'Create one to begin'}
                </span>
              </div>
              <ChevronsUpDown className='ms-auto size-4 opacity-50' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((workspace, index) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => setActiveWorkspace(workspace)}
                className='gap-2 p-2 cursor-pointer'
              >
                <div 
                  className={cn(
                    'flex size-6 items-center justify-center rounded-sm text-[8px] font-bold text-white uppercase border border-border shrink-0',
                    index % 5 === 0 && 'bg-chart-1',
                    index % 5 === 1 && 'bg-chart-2',
                    index % 5 === 2 && 'bg-chart-3',
                    index % 5 === 3 && 'bg-chart-4',
                    index % 5 === 4 && 'bg-chart-5',
                  )}
                >
                  {workspace.slug.slice(0, 3)}
                </div>
                <span className='flex-1 truncate text-sm'>{workspace.name}</span>
                <DropdownMenuShortcut className='opacity-50 text-[10px]'>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className='gap-2 p-2 cursor-pointer'
              onClick={() => navigate({ 
                to: '/settings/workspaces',
              })}
            >
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <Plus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground text-xs'>Add workspace</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}