// dashboard/src/components/organization-dropdown.tsx
import { Link } from '@tanstack/react-router'
import { BadgeCheck, LogOut, Palette, Briefcase } from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { useAuthStore } from '@/stores/auth-store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  // DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'

export function OrganizationDropdown() {
  const [open, setOpen] = useDialogState()
  const { auth } = useAuthStore()

  const org = auth.organization
  const initials = org?.name?.slice(0, 2).toUpperCase() || 'OR'

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0'>
            <Avatar className='h-8 w-8 border border-border shadow-sm'>
              <AvatarFallback className='bg-primary text-primary-foreground text-[10px] font-bold'>
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1'>
              <p className='text-sm leading-none font-semibold'>{org?.name || 'Organization'}</p>
              <p className='text-xs leading-none text-muted-foreground'>{org?.email || ''}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to='/settings'>
                <BadgeCheck className='mr-2 h-4 w-4 text-muted-foreground' />
                Account
                {/* <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut> */}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings/workspaces'>
                <Briefcase className='mr-2 h-4 w-4 text-muted-foreground' />
                Workspaces
                {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings/appearance'>
                <Palette className='mr-2 h-4 w-4 text-muted-foreground' />
                Appearance
                {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            <LogOut className='mr-2 h-4 w-4' />
            Sign out
            {/* <DropdownMenuShortcut className='text-current'>⇧⌘Q</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}