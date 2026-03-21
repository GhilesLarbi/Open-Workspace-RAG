import { useEffect, useRef } from 'react'
import { useChatStore } from '@/stores/chat-store'
import { useSession } from './use-session'

export type { MessageTiming } from '@/stores/chat-store'

export function useChat(apiKey: string) {
  const { sessionId, resetSession } = useSession()
  const historyFetchedRef = useRef<string | null>(null)

  const {
    messages,
    timings,
    isStreaming,
    activeDebug,
    isLoadingHistory,
    hasMoreHistory,
    sendMessage: storeSend,
    loadHistory,
    clearMessages,
  } = useChatStore()

  // Fetch initial history whenever sessionId changes (new workspace or new session)
  useEffect(() => {
    if (!apiKey) return
    if (historyFetchedRef.current === sessionId) return
    historyFetchedRef.current = sessionId

    useChatStore.getState().clearMessages()
    void useChatStore.getState().loadHistory(sessionId, apiKey, false)
  }, [sessionId, apiKey])

  const sendMessage = (query: string, tags: string[]) => {
    void storeSend(query, tags, sessionId, apiKey)
  }

  const loadMoreHistory = () => {
    if (!apiKey || isLoadingHistory || !hasMoreHistory) return
    void loadHistory(sessionId, apiKey, true)
  }

  const currentDebug =
    activeDebug ??
    [...messages].reverse().find((m) => m.role === 'assistant' && m.debug)?.debug ??
    null

  return {
    messages,
    timings,
    isStreaming,
    currentDebug,
    isLoadingHistory,
    hasMoreHistory,
    sessionId,
    sendMessage,
    loadMoreHistory,
    clearMessages,
    resetSession,
  }
}
