import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useJobs } from './jobs-provider'

export function JobsPrimaryButtons() {
  const { setOpen } = useJobs()
  return (
    <div className='flex gap-2'>
      {/* <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('invite')}
      >
        <span>Invite User</span> <MailPlus size={18} />
      </Button> */}
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Job</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}
