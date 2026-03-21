import { ScrollArea } from '@/components/ui/scroll-area'
import { ChunkItem } from './chunk-item'
import type { ChatDebugDoc } from '../data/schema'

type FlatChunk = {
  id: string
  rank: number
  title: string
  chunkIndex: number
  url: string
  score: number
  content: string
}

function flattenAndSort(docs: ChatDebugDoc[]): FlatChunk[] {
  return docs
    .flatMap((doc) =>
      doc.chunks.map((chunk) => ({
        id: chunk.id,
        title: doc.title ?? 'Untitled',
        chunkIndex: chunk.chunk_index,
        url: doc.url,
        score: chunk.db_score != null ? (1 - chunk.db_score) * 100 : 0,
        content: chunk.content,
      }))
    )
    .sort((a, b) => b.score - a.score)
    .map((chunk, i) => ({ ...chunk, rank: i + 1 }))
}

type Props = {
  docs: ChatDebugDoc[]
}

export function DebugPanel({ docs }: Props) {
  const chunks = flattenAndSort(docs)

  if (chunks.length === 0) {
    return (
      <div className='flex h-full items-center justify-center p-6'>
        <p className='text-center text-sm text-muted-foreground'>
          Retrieved chunks will appear here after you send a message.
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className='h-full'>
      <div className='flex w-full flex-col gap-2 overflow-hidden p-4'>
        {chunks.map((chunk) => (
          <ChunkItem
            key={chunk.id}
            rank={chunk.rank}
            title={chunk.title}
            chunkIndex={chunk.chunkIndex}
            url={chunk.url}
            score={chunk.score}
            content={chunk.content}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
