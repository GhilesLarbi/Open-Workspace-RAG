import { create } from 'zustand'
import { chatApi } from '@/features/chat/api'
import type { ChatMessage, ChatDebug, SessionTurnResponse } from '@/features/chat/data/schema'

export type MessageTiming = {
  startedAt: number
  duration: number | null
}

const HISTORY_PAGE_SIZE = 20

type ChatState = {
  messages: ChatMessage[]
  timings: (MessageTiming | null)[]
  isStreaming: boolean
  activeDebug: ChatDebug | null
  isLoadingHistory: boolean
  hasMoreHistory: boolean
  historySkip: number
}

type ChatActions = {
  sendMessage: (
    query: string,
    tags: string[],
    sessionId: string | null,
    apiKey: string,
    onSessionId: (id: string) => void
  ) => Promise<void>
  loadHistory: (sessionId: string, apiKey: string, prepend?: boolean) => Promise<void>
  clearMessages: () => void
}

function turnsToMessages(turns: SessionTurnResponse[]): {
  messages: ChatMessage[]
  timings: (MessageTiming | null)[]
} {
  const messages: ChatMessage[] = []
  const timings: (MessageTiming | null)[] = []
  for (const turn of turns) {
    messages.push({ role: 'user', content: turn.query })
    timings.push(null)
    messages.push({ role: 'assistant', content: turn.response })
    timings.push(null)
  }
  return { messages, timings }
}

export const useChatStore = create<ChatState & ChatActions>()((set, get) => ({
  messages: [],
  timings: [],
  isStreaming: false,
  activeDebug: null,
  isLoadingHistory: false,
  hasMoreHistory: false,
  historySkip: 0,

  sendMessage: async (query, tags, sessionId, apiKey, onSessionId) => {
    if (get().isStreaming || !query.trim() || !apiKey) return

    const now = Date.now()

    set((state) => ({
      messages: [
        ...state.messages,
        { role: 'user' as const, content: query },
        { role: 'assistant' as const, content: '' },
      ],
      timings: [...state.timings, null, { startedAt: now, duration: null }],
      isStreaming: true,
      activeDebug: null,
    }))

    let debugData: ChatDebug | null = null

    await chatApi.stream(query, tags, sessionId, apiKey, {
      onSessionId,
      onDebug: (debug) => {
        debugData = debug
        set({ activeDebug: debug })
      },
      onChunk: (chunk) => {
        set((state) => {
          const messages = [...state.messages]
          const last = messages[messages.length - 1]
          if (!last || last.role !== 'assistant') return state
          messages[messages.length - 1] = { ...last, content: last.content + chunk }
          return { messages }
        })
      },
      onDone: () => {
        const duration = Date.now() - now
        set((state) => {
          const messages = [...state.messages]
          const last = messages[messages.length - 1]
          if (last?.role === 'assistant') {
            messages[messages.length - 1] = {
              ...last,
              debug: debugData ?? undefined,
            }
          }
          const timings = [...state.timings]
          const idx = timings.length - 1
          if (idx >= 0 && timings[idx] !== null) {
            timings[idx] = { ...(timings[idx] as MessageTiming), duration }
          }
          return { messages, timings, isStreaming: false }
        })
      },
      onError: (error) => {
        const duration = Date.now() - now
        set((state) => {
          const messages = [...state.messages]
          const last = messages[messages.length - 1]
          if (last?.role === 'assistant') {
            messages[messages.length - 1] = { ...last, content: error }
          }
          const timings = [...state.timings]
          const idx = timings.length - 1
          if (idx >= 0 && timings[idx] !== null) {
            timings[idx] = { ...(timings[idx] as MessageTiming), duration }
          }
          return { messages, timings, isStreaming: false }
        })
      },
    })
  },

  loadHistory: async (sessionId, apiKey, prepend = false) => {
    const state = get()
    if (state.isLoadingHistory) return

    set({ isLoadingHistory: true })

    const skip = prepend ? state.historySkip + HISTORY_PAGE_SIZE : 0
    const data = await chatApi.fetchHistory(sessionId, apiKey, skip, HISTORY_PAGE_SIZE)

    if (!data || data.turns.length === 0) {
      set({ isLoadingHistory: false, hasMoreHistory: false })
      return
    }

    const { messages: newMessages, timings: newTimings } = turnsToMessages(data.turns)

    set((s) => ({
      messages: [...newMessages, ...s.messages],
      timings: [...newTimings, ...s.timings],
      isLoadingHistory: false,
      hasMoreHistory: data.turns.length === HISTORY_PAGE_SIZE,
      historySkip: skip,
    }))
  },

  clearMessages: () =>
    set({
      messages: [],
      timings: [],
      activeDebug: null,
      isLoadingHistory: false,
      hasMoreHistory: false,
      historySkip: 0,
    }),
}))
