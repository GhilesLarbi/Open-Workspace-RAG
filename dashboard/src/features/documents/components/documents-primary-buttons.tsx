import { Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function DocumentsPrimaryButtons() {
  const navigate = useNavigate()
  return (
    <div className='flex gap-2'>
      <Button className='gap-2' onClick={() => navigate({ to: '/documents/add' })}>
        <Plus size={18} />
        Add Document
      </Button>
    </div>
  )
}
