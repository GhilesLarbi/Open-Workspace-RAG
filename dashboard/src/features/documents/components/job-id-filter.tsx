import { Check, PlusCircle, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useJobs } from '@/features/jobs/hooks'

interface JobIdFilterProps {
  selectedJobIds: string[]
  onJobIdsChange: (jobIds: string[]) => void
}

export function JobIdFilter({
  selectedJobIds,
  onJobIdsChange,
}: JobIdFilterProps) {
  const { data: jobsData, isLoading } = useJobs({ limit: 100 })
  const jobs = jobsData?.items ?? []

  const toggleJob = (jobId: string) => {
    const next = selectedJobIds.includes(jobId)
      ? selectedJobIds.filter((id) => id !== jobId)
      : [...selectedJobIds, jobId]
    onJobIdsChange(next)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircle className='mr-2 h-4 w-4' />
          Jobs
          {selectedJobIds.length > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selectedJobIds.length}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {selectedJobIds.length > 2 ? (
                  <Badge
                    variant='secondary'
                    className='rounded-sm px-1 font-normal'
                  >
                    {selectedJobIds.length} selected
                  </Badge>
                ) : (
                  jobs
                    .filter((job) => selectedJobIds.includes(job.id))
                    .map((job) => (
                      <Badge
                        variant='secondary'
                        key={job.id}
                        className='rounded-sm px-1 font-normal'
                      >
                        {job.config?.url || job.id.substring(0, 8)}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0' align='start'>
        <Command>
          <CommandInput placeholder="Filter jobs..." />
          <CommandList>
            <CommandEmpty>No jobs found.</CommandEmpty>
            <CommandGroup>
              {isLoading ? (
                <div className='p-4 text-center text-sm text-muted-foreground'>
                  Loading jobs...
                </div>
              ) : (
                jobs.map((job) => {
                  const isSelected = selectedJobIds.includes(job.id)
                  return (
                    <CommandItem
                      key={job.id}
                      onSelect={() => toggleJob(job.id)}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <Check className={cn('h-4 w-4')} />
                      </div>
                      <Globe className='mr-2 h-4 w-4 text-muted-foreground' />
                      <div className='flex flex-col'>
                        <span className='truncate max-w-[200px]'>{job.config?.url || 'Job'}</span>
                        <span className='text-[10px] text-muted-foreground font-mono'>
                          {job.id.substring(0, 8)}...
                        </span>
                      </div>
                    </CommandItem>
                  )
                })
              )}
            </CommandGroup>
            {selectedJobIds.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onJobIdsChange([])}
                    className='justify-center text-center'
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
