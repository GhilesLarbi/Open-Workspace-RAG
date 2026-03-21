import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  onSend: (query: string) => void
  disabled: boolean
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex w-full flex-none gap-2 border-t p-4'>
      <div className='flex flex-1 items-center rounded-md border border-input bg-background px-2 py-1 focus-within:ring-1 focus-within:ring-ring focus-within:outline-hidden'>
        <label className='flex-1'>
          <span className='sr-only'>Chat input</span>
          <input
            type='text'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Ask a question…'
            className='h-8 w-full bg-inherit text-sm focus-visible:outline-hidden'
            disabled={disabled}
          />
        </label>
        <Button
          type='submit'
          variant='ghost'
          size='icon'
          className='shrink-0'
          disabled={disabled || !value.trim()}
          aria-label='Send message'
        >
          <Send size={16} />
        </Button>
      </div>
    </form>
  )
}
