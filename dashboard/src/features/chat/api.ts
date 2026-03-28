import type { ChatDebug, SessionResponse } from './data/schema'

type StreamCallbacks = {
  onSessionId: (id: string) => void
  onDebug: (debug: ChatDebug) => void
  onChunk: (content: string) => void
  onDone: () => void
  onError: (error: string) => void
}

function getBaseUrl() {
  return import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'
}

export const chatApi = {
  stream: async (
    query: string,
    tags: string[],
    sessionId: string | null,
    apiKey: string,
    callbacks: StreamCallbacks
  ): Promise<void> => {
    let response: Response
    try {
      response = await fetch(`${getBaseUrl()}/chat/ask/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ query, tags, session_id: sessionId, debug: true }),
      })
    } catch {
      callbacks.onError('Failed to connect to the server.')
      return
    }

    if (!response.ok) {
      callbacks.onError(`Server error: ${response.status}`)
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      callbacks.onError('No response body received.')
      return
    }

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw) continue

          try {
            const parsed: { session_id?: string; content?: string; debug?: ChatDebug } = JSON.parse(raw)
            if (parsed.session_id !== undefined) {
              callbacks.onSessionId(parsed.session_id)
            } else if (parsed.debug !== undefined) {
              callbacks.onDebug(parsed.debug)
            } else if (parsed.content) {
              callbacks.onChunk(parsed.content)
            }
          } catch {
            // skip malformed SSE data
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    callbacks.onDone()
  },

  fetchHistory: async (
    sessionId: string,
    apiKey: string,
    skip = 0,
    limit = 20
  ): Promise<SessionResponse | null> => {
    try {
      const response = await fetch(
        `${getBaseUrl()}/chat/${sessionId}?skip=${skip}&limit=${limit}`,
        { headers: { 'x-api-key': apiKey } }
      )
      if (!response.ok) return null
      return (await response.json()) as SessionResponse
    } catch {
      return null
    }
  },

  rate: async (sessionId: string, isHelpful: boolean, apiKey: string): Promise<void> => {
    const response = await fetch(`${getBaseUrl()}/ratings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ session_id: sessionId, is_helpful: isHelpful }),
    })
    if (!response.ok) throw new Error(`Failed to submit rating: ${response.status}`)
  },
}
