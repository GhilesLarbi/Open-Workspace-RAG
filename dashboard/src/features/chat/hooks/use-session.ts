import { useState } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const SESSION_COOKIE = 'rag_session_id'
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

export function clearStoredSession() {
  removeCookie(SESSION_COOKIE)
}

export function useSession() {
  const [sessionId, setSessionId] = useState<string | null>(() => getCookie(SESSION_COOKIE) ?? null)

  // Called when the backend returns a session_id (first SSE event)
  const receiveSession = (id: string) => {
    setCookie(SESSION_COOKIE, id, SESSION_MAX_AGE)
    setSessionId(id)
  }

  // Called after a successful history fetch to slide the cookie TTL forward
  const refreshSession = () => {
    if (sessionId) {
      setCookie(SESSION_COOKIE, sessionId, SESSION_MAX_AGE)
    }
  }

  // Clear session — next message will get a fresh session_id from the backend
  const resetSession = () => {
    clearStoredSession()
    setSessionId(null)
  }

  return { sessionId, receiveSession, refreshSession, resetSession }
}
