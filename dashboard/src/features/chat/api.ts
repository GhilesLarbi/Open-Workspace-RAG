import type { ChatDebugDoc } from './data/schema'

type StreamCallbacks = {
  onDebug: (debug: ChatDebugDoc[]) => void
  onChunk: (content: string) => void
  onDone: () => void
  onError: (error: string) => void
}

export const chatApi = {
  stream: async (
    query: string,
    tags: string[],
    apiKey: string,
    callbacks: StreamCallbacks
  ): Promise<void> => {
    const baseUrl =
      import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

    let response: Response
    try {
      response = await fetch(`${baseUrl}/chat/ask/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ query, tags, debug: true }),
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
            const parsed: { content: string; debug?: ChatDebugDoc[] } =
              JSON.parse(raw)
            if (parsed.debug !== undefined) {
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
}
