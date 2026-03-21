import { useChatStore } from '@/stores/chat-store'

export type { MessageTiming } from '@/stores/chat-store'

export function useChat(apiKey: string) {
  const { messages, timings, isStreaming, activeDebug, sendMessage: storeSend, clearMessages } =
    useChatStore()

  const sendMessage = (query: string, tags: string[]) => storeSend(query, tags, apiKey)

  const currentDebug =
    activeDebug.length > 0
      ? activeDebug
      : ([...messages]
          .reverse()
          .find((m) => m.role === 'assistant' && m.debug)?.debug ?? [])

  return { messages, timings, isStreaming, currentDebug, sendMessage, clearMessages }
}
