import { useEffect, useRef } from 'react'
import { useChatStore } from '@/stores/chat-store'
import { useSession } from './use-session'

export type { MessageTiming } from '@/stores/chat-store'

export function useChat(apiKey: string) {
  const { sessionId, receiveSession, refreshSession, resetSession } = useSession()
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

  // Load history when a known session_id is present (e.g. on page load / workspace switch)
  useEffect(() => {
    if (!apiKey || !sessionId) return
    if (historyFetchedRef.current === sessionId) return
    historyFetchedRef.current = sessionId

    useChatStore.getState().clearMessages()
    void useChatStore.getState().loadHistory(sessionId, apiKey, false)
      .then(() => refreshSession())
  }, [sessionId, apiKey])

  const sendMessage = (query: string, tags: string[]) => {
    void storeSend(query, tags, sessionId, apiKey, (id) => {
      // Mark this id as already-fetched so the useEffect doesn't load history
      // for a brand-new session that obviously has no prior turns
      historyFetchedRef.current = id
      receiveSession(id)
    })
  }

  const loadMoreHistory = () => {
    if (!apiKey || !sessionId || isLoadingHistory || !hasMoreHistory) return
    void loadHistory(sessionId, apiKey, true).then(() => refreshSession())
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
