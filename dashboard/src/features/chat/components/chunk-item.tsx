import { useState } from 'react'
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Markdown } from '@/components/ui/markdown'

type Props = {
  rank: number
  title: string
  chunkIndex: number
  url: string
  score: number // (1 - raw) * 100 — already computed
  content: string
}

export function ChunkItem({ rank, title, chunkIndex, url, score, content }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className='w-full overflow-hidden rounded-lg border'>
      {/* grid: chevron col is fixed, body col is 1fr — hard constrains body width */}
      <button
        type='button'
        onClick={() => setExpanded((v) => !v)}
        className='grid w-full grid-cols-[14px_1fr] items-start gap-2 p-3 text-left transition-colors hover:bg-muted/50'
      >
        {/* Chevron */}
        <span className='mt-0.5 text-muted-foreground'>
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>

        {/* Body — 1fr col, so width is always panel-width minus chevron */}
        <div className='space-y-1 overflow-hidden'>
          {/* Row 1: rank + title — grid so title 1fr is hard-constrained */}
          <div className='grid grid-cols-[16px_1fr] items-center gap-1.5'>
            <span className='flex size-4 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground'>
              {rank}
            </span>
            <span className='truncate text-xs font-medium'>
              {title} · #{chunkIndex}
            </span>
          </div>

          {/* Row 2: url + score — grid so url 1fr is hard-constrained */}
          <div className='grid grid-cols-[1fr_auto] items-center gap-2'>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='grid grid-cols-[10px_1fr] items-center gap-1 text-xs text-muted-foreground hover:text-primary'
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={10} />
              <span className='truncate'>{url}</span>
            </a>
            <span className='font-mono text-xs font-semibold tabular-nums text-foreground'>
              {score.toFixed(1)}%
            </span>
          </div>
        </div>
      </button>

      {/* Expandable content */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          expanded ? 'max-h-[9999px]' : 'max-h-0'
        )}
      >
        <div className='border-t bg-muted/20 px-4 py-3'>
          <Markdown className='break-words text-xs leading-relaxed text-foreground/80'>
            {content}
          </Markdown>
        </div>
      </div>
    </div>
  )
}
