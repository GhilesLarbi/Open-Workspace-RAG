import { ArrowLeft } from 'lucide-react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { JobForm } from '@/features/jobs/components/job-form'
import { useCreateJob } from '@/features/jobs/hooks'
import type { JobConfigInput } from '@/features/jobs/data/schema'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_authenticated/jobs/create')({
  component: JobsCreate,
})

function JobsCreate() {
  const navigate = useNavigate()
  const createJob = useCreateJob()

  const handleSubmit = async (data: JobConfigInput) => {
    await createJob.mutateAsync(data, {
      onSuccess: () => {
        toast.success('Job created and scheduled')
        navigate({ to: '/jobs' })
      },
      onError: () => {
        toast.error('Failed to create job')
      },
    })
  }

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main fixed>
        <div className='space-y-0.5'>
          <div className='flex items-center gap-2 mb-2'>
            <Button
              variant='ghost'
              size='sm'
              className='gap-1 -ml-3'
              onClick={() => navigate({ to: '/jobs' })}
            >
              <ArrowLeft className='h-4 w-4' />
              Back to Jobs
            </Button>
          </div>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            New Crawl Job
          </h1>
          <p className='text-muted-foreground'>
            Configure and schedule a new crawl job for your workspace.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col overflow-y-auto scroll-smooth pe-4 pb-12'>
          <div className='-mx-1 px-1.5 lg:max-w-3xl'>
            <JobForm onSubmit={handleSubmit} isPending={createJob.isPending} />
          </div>
        </div>
      </Main>
    </>
  )
}
