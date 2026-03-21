import { useState } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const SESSION_COOKIE = 'rag_session_id'
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

export function getOrCreateSession(): string {
  const existing = getCookie(SESSION_COOKIE)
  if (existing) return existing

  const sessionId = crypto.randomUUID()
  setCookie(SESSION_COOKIE, sessionId, SESSION_MAX_AGE)
  return sessionId
}

export function clearStoredSession() {
  removeCookie(SESSION_COOKIE)
}

export function useSession() {
  // Lazy initializer runs once on mount — no extra render, no effect needed
  const [sessionId, setSessionId] = useState<string>(() => getOrCreateSession())

  const resetSession = () => {
    clearStoredSession()
    setSessionId(getOrCreateSession())
  }

  return { sessionId, resetSession }
}
