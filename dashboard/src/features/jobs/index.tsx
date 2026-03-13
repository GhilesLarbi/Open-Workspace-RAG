import { getRouteApi, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { OrganizationDropdown } from '@/components/organization-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { JobsDialogs } from './components/jobs-dialogs'
import { JobsPrimaryButtons } from './components/jobs-primary-buttons'
import { JobsProvider, useJobs } from './components/jobs-provider'
import { JobsTable } from './components/jobs-table'

const route = getRouteApi('/_authenticated/jobs/')

function JobsContent() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { jobs } = useJobs()

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Jobs List</h2>
            <p className='text-muted-foreground'>
              Manage your jobs and their configs here.
            </p>
          </div>
          <JobsPrimaryButtons />
        </div>
        <JobsTable data={jobs} search={search} navigate={navigate} />
      </Main>
      <JobsDialogs />
    </>
  )
}

export function Jobs() {
  return (
    <>
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
      
      <JobsProvider>
        <JobsContent />
      </JobsProvider>
    </>
  )
}