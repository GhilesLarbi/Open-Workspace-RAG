import { useRef, useEffect, useState } from 'react'
import { Bot, Copy, ThumbsDown, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TextShimmer } from '@/components/ui/text-shimmer'
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageActions,
  MessageAction,
} from '@/components/ui/message'
import type { ChatMessage } from '../data/schema'
import type { MessageTiming } from '../hooks/use-chat'

type Props = {
  messages: ChatMessage[]
  timings: (MessageTiming | null)[]
  isStreaming: boolean
}

type Feedback = 'liked' | 'disliked' | null

function formatSeconds(ms: number): string {
  return (ms / 1000).toFixed(1) + 's'
}

function LiveTimer({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 100)
    return () => clearInterval(id)
  }, [])

  return (
    <span className='text-xs text-muted-foreground/60'>
      {formatSeconds(now - startedAt)}
    </span>
  )
}

export function ChatMessages({ messages, timings, isStreaming }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [feedback, setFeedback] = useState<Record<number, Feedback>>({})

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className='flex min-h-0 flex-1 items-center justify-center p-6'>
        <div className='flex flex-col items-center space-y-4 text-center'>
          <div className='flex size-16 items-center justify-center rounded-full border-2 border-border'>
            <Bot className='size-8' />
          </div>
          <div className='space-y-1'>
            <h2 className='text-xl font-semibold'>RAG Assistant</h2>
            <p className='text-sm text-muted-foreground'>
              Ask a question to search your knowledge base.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className='min-h-0 flex-1'>
      <div className='flex flex-col gap-6 p-4'>
        {messages.map((msg, i) => {
          const timing = timings[i] ?? null
          const isLastStreaming =
            isStreaming && i === messages.length - 1 && msg.role === 'assistant'

          if (msg.role === 'user') {
            return (
              <Message key={i} className='justify-end'>
                <MessageContent className='max-w-[70%]'>
                  {msg.content}
                </MessageContent>
              </Message>
            )
          }

          return (
            <Message key={i} className='items-start'>
              <MessageAvatar src='' alt='AI' fallback='AI' />
              <div className='flex max-w-[70%] flex-col gap-1'>
                {/* shimmer while waiting for first token, markdown once content arrives */}
                {isLastStreaming && !msg.content ? (
                  <div className='flex h-8 items-center'>
                    <TextShimmer className='text-sm'>
                      Deep reasoning in progress
                    </TextShimmer>
                  </div>
                ) : (
                  <MessageContent markdown className='bg-transparent p-0'>
                    {msg.content}
                  </MessageContent>
                )}

                {/* Actions — only after streaming is done */}
                {!isLastStreaming && (
                  <MessageActions>
                    <MessageAction tooltip='Copy'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-7 w-7 rounded-full'
                        onClick={() =>
                          navigator.clipboard.writeText(msg.content)
                        }
                      >
                        <Copy className='size-3.5' />
                      </Button>
                    </MessageAction>
                    <MessageAction tooltip='Helpful'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className={cn(
                          'h-7 w-7 rounded-full',
                          feedback[i] === 'liked' &&
                            'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        )}
                        onClick={() =>
                          setFeedback((prev) => ({
                            ...prev,
                            [i]: prev[i] === 'liked' ? null : 'liked',
                          }))
                        }
                      >
                        <ThumbsUp className='size-3.5' />
                      </Button>
                    </MessageAction>
                    <MessageAction tooltip='Not helpful'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className={cn(
                          'h-7 w-7 rounded-full',
                          feedback[i] === 'disliked' &&
                            'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        )}
                        onClick={() =>
                          setFeedback((prev) => ({
                            ...prev,
                            [i]: prev[i] === 'disliked' ? null : 'disliked',
                          }))
                        }
                      >
                        <ThumbsDown className='size-3.5' />
                      </Button>
                    </MessageAction>
                  </MessageActions>
                )}

                {/* Timer — always below, counts up during streaming, fixed after done */}
                {timing !== null && (
                  <div className='px-1'>
                    {timing.duration !== null ? (
                      <span className='text-xs text-muted-foreground/60'>
                        {formatSeconds(timing.duration)}
                      </span>
                    ) : (
                      <LiveTimer startedAt={timing.startedAt} />
                    )}
                  </div>
                )}
              </div>
            </Message>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
