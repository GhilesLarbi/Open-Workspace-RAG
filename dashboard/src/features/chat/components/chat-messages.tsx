import { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react'
import { Bot, Copy, ThumbsDown, ThumbsUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
import { useRating } from '../hooks/use-rating'

type Props = {
  messages: ChatMessage[]
  timings: (MessageTiming | null)[]
  isStreaming: boolean
  isLoadingHistory: boolean
  hasMoreHistory: boolean
  onLoadMore: () => void
  sessionId: string | null
  apiKey: string
}

type RatedIdx = { idx: number; value: 'liked' | 'disliked' } | null

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

export function ChatMessages({
  messages,
  timings,
  isStreaming,
  isLoadingHistory,
  hasMoreHistory,
  onLoadMore,
  sessionId,
  apiKey,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [ratedIdx, setRatedIdx] = useState<RatedIdx>(null)
  const { mutate: submitRating, isPending: isRatingPending } = useRating(apiKey)

  const lastAssistantIdx = messages.reduce((last, msg, i) => (msg.role === 'assistant' ? i : last), -1)
  const rated = ratedIdx?.idx === lastAssistantIdx ? ratedIdx.value : null

  // Track whether user is close enough to the bottom to keep auto-scrolling
  const isAtBottomRef = useRef(true)
  // Distinguish initial history load (scroll to bottom) from load-more (keep position)
  const wasInitialLoadRef = useRef(false)
  const prevIsLoadingRef = useRef(false)
  // For load-more: save scrollHeight before prepend, restore after DOM update
  const scrollHeightBeforeRef = useRef(0)
  const shouldRestoreScrollRef = useRef(false)

  // Stable refs so scroll handler doesn't need to re-register on every render
  const isLoadingHistoryRef = useRef(isLoadingHistory)
  const hasMoreHistoryRef = useRef(hasMoreHistory)
  const onLoadMoreRef = useRef(onLoadMore)

  useEffect(() => {
    isLoadingHistoryRef.current = isLoadingHistory
    hasMoreHistoryRef.current = hasMoreHistory
    onLoadMoreRef.current = onLoadMore
  }, [isLoadingHistory, hasMoreHistory, onLoadMore])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const vp = viewportRef.current
    if (!vp) return
    vp.scrollTo({ top: vp.scrollHeight, behavior })
  }, [])

  // Attach scroll listener once — reads state via refs
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return

    const onScroll = () => {
      const distFromBottom = vp.scrollHeight - vp.scrollTop - vp.clientHeight
      isAtBottomRef.current = distFromBottom < 60

      // Trigger load-more when near top
      if (vp.scrollTop < 80 && hasMoreHistoryRef.current && !isLoadingHistoryRef.current) {
        // Snapshot scrollHeight NOW — before isLoadingHistory=true re-renders the spinner
        scrollHeightBeforeRef.current = vp.scrollHeight
        shouldRestoreScrollRef.current = true
        onLoadMoreRef.current()
      }
    }

    vp.addEventListener('scroll', onScroll, { passive: true })
    return () => vp.removeEventListener('scroll', onScroll)
  }, [])

  // Auto-scroll on every message change (streaming chunks + new messages)
  // Only fires if user hasn't scrolled up
  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom('smooth')
    }
  }, [messages, scrollToBottom])

  // Track initial vs load-more, and scroll to bottom when initial load finishes
  useEffect(() => {
    if (!prevIsLoadingRef.current && isLoadingHistory) {
      wasInitialLoadRef.current = messages.length === 0
    }
    if (prevIsLoadingRef.current && !isLoadingHistory && wasInitialLoadRef.current) {
      scrollToBottom('instant')
    }
    prevIsLoadingRef.current = isLoadingHistory
  }, [isLoadingHistory, messages.length, scrollToBottom])

  // After DOM updates from load-more: restore scroll position so user doesn't jump
  useLayoutEffect(() => {
    if (!isLoadingHistory && shouldRestoreScrollRef.current) {
      const vp = viewportRef.current
      if (vp) {
        vp.scrollTop = vp.scrollHeight - scrollHeightBeforeRef.current
      }
      shouldRestoreScrollRef.current = false
    }
  }, [isLoadingHistory, messages.length])

  return (
    <div ref={viewportRef} className='min-h-0 flex-1 overflow-y-auto'>
      {messages.length === 0 && !isLoadingHistory ? (
        <div className='flex h-full items-center justify-center p-6'>
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
      ) : (
      <div className='flex flex-col gap-6 p-4'>

        {/* History loading indicator */}
        {isLoadingHistory && (
          <div className='flex items-center justify-center py-2'>
            <Loader2 className='size-4 animate-spin text-muted-foreground' />
            <span className='ml-2 text-xs text-muted-foreground'>Loading history…</span>
          </div>
        )}

        {messages.map((msg, i) => {
          const timing = timings[i] ?? null
          const isLastStreaming =
            isStreaming && i === messages.length - 1 && msg.role === 'assistant'

          if (msg.role === 'user') {
            return (
              <Message key={i} className='justify-end'>
                <MessageContent className='max-w-[70%]'>{msg.content}</MessageContent>
              </Message>
            )
          }

          return (
            <Message key={i} className='items-start'>
              <MessageAvatar src='' alt='AI' fallback='AI' />
              <div className='flex max-w-[70%] flex-col gap-1'>
                {isLastStreaming && !msg.content ? (
                  <div className='flex h-8 items-center'>
                    <TextShimmer className='text-sm'>Deep reasoning in progress</TextShimmer>
                  </div>
                ) : (
                  <MessageContent markdown className='bg-transparent p-0'>
                    {msg.content}
                  </MessageContent>
                )}

                {!isLastStreaming && (
                  <MessageActions>
                    <MessageAction tooltip='Copy'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-7 w-7 rounded-full'
                        onClick={() => navigator.clipboard.writeText(msg.content)}
                      >
                        <Copy className='size-3.5' />
                      </Button>
                    </MessageAction>
                    {i === lastAssistantIdx && (
                      <>
                        <MessageAction tooltip='Helpful'>
                          <Button
                            variant='ghost'
                            size='icon'
                            disabled={rated !== null || isRatingPending}
                            className={cn(
                              'h-7 w-7 rounded-full',
                              rated === 'liked' &&
                                'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            )}
                            onClick={() => {
                              if (!sessionId) return
                              setRatedIdx({ idx: i, value: 'liked' })
                              submitRating({ sessionId, isHelpful: true })
                            }}
                          >
                            <ThumbsUp className='size-3.5' />
                          </Button>
                        </MessageAction>
                        <MessageAction tooltip='Not helpful'>
                          <Button
                            variant='ghost'
                            size='icon'
                            disabled={rated !== null || isRatingPending}
                            className={cn(
                              'h-7 w-7 rounded-full',
                              rated === 'disliked' &&
                                'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            )}
                            onClick={() => {
                              if (!sessionId) return
                              setRatedIdx({ idx: i, value: 'disliked' })
                              submitRating({ sessionId, isHelpful: false })
                            }}
                          >
                            <ThumbsDown className='size-3.5' />
                          </Button>
                        </MessageAction>
                      </>
                    )}
                  </MessageActions>
                )}

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

        <div />
      </div>
      )}
    </div>
  )
}
