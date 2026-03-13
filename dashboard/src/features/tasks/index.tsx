import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { OrganizationDropdown } from '@/components/organization-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { TasksProvider } from './components/tasks-provider'
import { TasksTable } from './components/tasks-table'
import { tasks } from './data/tasks'

export function Tasks() {
  return (
    <TasksProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <Button
            variant='ghost'
            size='icon'
            className='rounded-full'
            asChild
          >
            <Link to='/settings/appearance' title='Appearance Settings'>
              <Settings className='size-5' />
              <span className='sr-only'>Appearance Settings</span>
            </Link>
          </Button>
          <OrganizationDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tasks</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <TasksTable data={tasks} />
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
