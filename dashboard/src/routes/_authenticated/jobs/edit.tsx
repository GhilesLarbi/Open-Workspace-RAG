import z from 'zod'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { JobForm } from '@/features/jobs/components/job-form'
import { useJob, useUpdateJob } from '@/features/jobs/hooks'
import type { JobConfigInput } from '@/features/jobs/data/schema'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Separator } from '@/components/ui/separator'

const editSearchSchema = z.object({
  jobId: z.string().uuid(),
})

export const Route = createFileRoute('/_authenticated/jobs/edit')({
  validateSearch: editSearchSchema,
  component: JobsEdit,
})

function JobsEdit() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const { data: job, isLoading } = useJob(search.jobId)
  const updateJob = useUpdateJob()

  const handleSubmit = async (data: JobConfigInput) => {
    await updateJob.mutateAsync(
      { jobId: search.jobId, config: data },
      {
        onSuccess: () => {
          toast.success('Job updated')
          navigate({ to: '/jobs' })
        },
        onError: () => {
          toast.error('Failed to update job')
        },
      }
    )
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex flex-1 items-center justify-center'>
          <div className='text-muted-foreground'>Loading job...</div>
        </div>
      )
    }

    if (!job) {
      return (
        <div className='flex flex-1 items-center justify-center'>
          <div className='text-destructive'>Job not found</div>
        </div>
      )
    }

    const defaultValues: Partial<JobConfigInput> = job.config
      ? {
          url: job.config.url,
          crawling: job.config.crawling ?? undefined,
          filtering: job.config.filtering,
          formating: job.config.formating,
        }
      : { url: '' }

    return (
      <div className='flex flex-1 flex-col overflow-y-auto scroll-smooth pe-4 pb-12'>
        <div className='-mx-1 px-1.5 lg:max-w-3xl'>
          <JobForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isPending={updateJob.isPending}
            isEditing={true}
          />
        </div>
      </div>
    )
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
            Edit Job
          </h1>
          <p className='text-muted-foreground'>
            Update the configuration for this crawl job.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        {renderContent()}
      </Main>
    </>
  )
}
