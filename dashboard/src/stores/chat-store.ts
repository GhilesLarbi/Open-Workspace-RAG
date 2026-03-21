import { create } from 'zustand'
import { chatApi } from '@/features/chat/api'
import type { ChatMessage, ChatDebugDoc } from '@/features/chat/data/schema'

export type MessageTiming = {
  startedAt: number
  duration: number | null
}

type ChatState = {
  messages: ChatMessage[]
  timings: (MessageTiming | null)[]
  isStreaming: boolean
  activeDebug: ChatDebugDoc[]
}

type ChatActions = {
  sendMessage: (query: string, tags: string[], apiKey: string) => Promise<void>
  clearMessages: () => void
}

export const useChatStore = create<ChatState & ChatActions>()((set, get) => ({
  messages: [],
  timings: [],
  isStreaming: false,
  activeDebug: [],

  sendMessage: async (query, tags, apiKey) => {
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
      activeDebug: [],
    }))

    let debugData: ChatDebugDoc[] = []

    await chatApi.stream(query, tags, apiKey, {
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
            messages[messages.length - 1] = { ...last, debug: debugData }
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

  clearMessages: () => set({ messages: [], timings: [], activeDebug: [] }),
}))
