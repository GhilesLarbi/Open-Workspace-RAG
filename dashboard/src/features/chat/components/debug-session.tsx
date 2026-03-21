import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Markdown } from '@/components/ui/markdown'
import type { SessionDebug, SessionTurn } from '../data/schema'

// ─── Turn card ────────────────────────────────────────────────────────────

function TurnCard({ turn, index }: { turn: SessionTurn; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const [chunksExpanded, setChunksExpanded] = useState(false)

  const ts = new Date(turn.timestamp)
  const timeLabel = ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateLabel = ts.toLocaleDateString([], { month: 'short', day: 'numeric' })

  return (
    <div className='overflow-hidden rounded-lg border'>
      {/* Header */}
      <button
        type='button'
        onClick={() => setExpanded((v) => !v)}
        className='grid w-full grid-cols-[14px_1fr] items-start gap-2 p-3 text-left transition-colors hover:bg-muted/50'
      >
        <span className='mt-0.5 text-muted-foreground'>
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <div className='space-y-1 overflow-hidden'>
          <div className='grid grid-cols-[16px_1fr_auto] items-center gap-1.5'>
            <span className='flex size-4 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground'>
              {index + 1}
            </span>
            <span className='truncate text-xs font-medium'>{turn.query}</span>
            <Badge variant='outline' className='shrink-0 text-[10px]'>
              {turn.chunks.length} chunks
            </Badge>
          </div>
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <span>
              {dateLabel} · {timeLabel}
            </span>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          expanded ? 'max-h-[9999px]' : 'max-h-0'
        )}
      >
        <div className='space-y-3 border-t bg-muted/10 p-3'>
          {/* Query */}
          <div className='space-y-1'>
            <p className='text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
              Query
            </p>
            <p className='text-xs'>{turn.query}</p>
          </div>

          {/* Response */}
          <div className='space-y-1'>
            <p className='text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
              Response
            </p>
            <Markdown className='break-words text-xs leading-relaxed text-foreground/80'>
              {turn.response}
            </Markdown>
          </div>

          {/* Chunks toggle */}
          {turn.chunks.length > 0 && (
            <div>
              <button
                type='button'
                onClick={() => setChunksExpanded((v) => !v)}
                className='flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground'
              >
                {chunksExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                {turn.chunks.length} chunks used
              </button>

              <div
                className={cn(
                  'overflow-hidden transition-all duration-200',
                  chunksExpanded ? 'mt-2 max-h-[9999px]' : 'max-h-0'
                )}
              >
                <div className='space-y-1.5'>
                  {turn.chunks.map((chunk) => (
                    <div
                      key={chunk.id}
                      className='rounded border bg-muted/20 p-2 text-xs'
                    >
                      <div className='mb-1 flex items-center justify-between gap-2'>
                        <span className='truncate font-mono text-[10px] text-muted-foreground'>
                          {chunk.id.slice(0, 8)}…
                        </span>
                        <span className='shrink-0 font-mono text-[10px] font-semibold'>
                          {((1 - chunk.score) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className='line-clamp-3 leading-relaxed text-foreground/70'>
                        {chunk.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Session debug panel ──────────────────────────────────────────────────

type Props = {
  session: SessionDebug
}

export function DebugSession({ session }: Props) {
  return (
    <ScrollArea className='h-full flex flex-col gap-4'>
        {session.turns.length === 0 ? (
          <p className='text-center text-xs text-muted-foreground'>
            No history messages used in this context window.
          </p>
        ) : (
          <div className='space-y-2'>
            {session.turns.map((turn, i) => (
              <TurnCard key={i} turn={turn} index={i} />
            ))}
          </div>
        )}
    </ScrollArea>
  )
}
