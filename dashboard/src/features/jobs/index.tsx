import { Link, getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useMemo } from 'react'
import { JobsProvider } from './components/provider'
import { JobsTable } from './components/table'
import { JobsDeleteDialog } from './components/delete-dialog'
import { useJobs } from './hooks'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'

const route = getRouteApi('/_authenticated/jobs/')

export function JobsIndex() {
  const search = route.useSearch()

  const { data, isLoading } = useJobs({
    skip: ((search.page ?? 1) - 1) * (search.pageSize ?? 10),
    limit: search.pageSize ?? 10,
    status: search.status,
  })

  const jobs = useMemo(() => data?.items ?? [], [data])

  return (
    <JobsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Jobs</h2>
            <p className='text-muted-foreground'>
              Manage your crawl jobs and monitor their progress.
            </p>
          </div>
          <Button asChild className='gap-1'>
            <Link to='/jobs/create'>
              <Plus size={18} />
              <span>New Job</span>
            </Link>
          </Button>
        </div>
        {isLoading ? (
          <div className='flex flex-1 items-center justify-center'>
            <div className='text-muted-foreground'>Loading jobs...</div>
          </div>
        ) : (
          <JobsTable data={jobs} total={data?.total ?? 0} />
        )}
      </Main>
      <JobsDeleteDialog />
    </JobsProvider>
  )
}
