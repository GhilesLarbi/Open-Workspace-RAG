import { FileText, History } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChunkItem } from './chunk-item'
import { DebugSession } from './debug-session'
import type { ChatDebug, ChatDebugDoc } from '../data/schema'

// ─── Documents tab ────────────────────────────────────────────────────────

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
        score: chunk.score != null ? (1 - chunk.score) * 100 : 0,
        content: chunk.content,
      }))
    )
    .sort((a, b) => b.score - a.score)
    .map((chunk, i) => ({ ...chunk, rank: i + 1 }))
}

function DocumentsTab({ docs }: { docs: ChatDebugDoc[] }) {
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
      <div className='flex w-full flex-col gap-2 overflow-hidden'>
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

// ─── Empty state ──────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className='flex h-full items-center justify-center p-6'>
      <p className='text-center text-sm text-muted-foreground'>
        Debug info will appear here after you send a message.
      </p>
    </div>
  )
}

// ─── Debug panel ──────────────────────────────────────────────────────────

type Props = {
  debug: ChatDebug | null
}

export function DebugPanel({ debug }: Props) {
  if (!debug) {
    return <EmptyState />
  }

  return (
    <Tabs defaultValue='documents' className='flex h-full flex-col gap-2 px-4 py-2'>
      <div className=''>
        <TabsList className='h-8'>
          <TabsTrigger value='documents' className='gap-1.5 text-xs'>
            <FileText size={12} />
            Documents
          </TabsTrigger>
          <TabsTrigger value='session' className='gap-1.5 text-xs'>
            <History size={12} />
            Session
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value='documents' className='mt-0 flex-1 overflow-hidden'>
        <DocumentsTab docs={debug.documents} />
      </TabsContent>

      <TabsContent value='session' className='mt-0 flex-1 overflow-hidden'>
        <DebugSession session={debug.session} />
      </TabsContent>
    </Tabs>
  )
}
