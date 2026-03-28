import { z } from 'zod'

// ─── Chunk & Document Debug ────────────────────────────────────────────────
export const chunkDebugSchema = z.object({
  id: z.string().uuid(),
  chunk_index: z.number().int(),
  content: z.string(),
  score: z.number().nullable().optional(),
})
export type ChunkDebug = z.infer<typeof chunkDebugSchema>

export const chatDebugDocSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  is_approved: z.boolean(),
  url: z.string(),
  title: z.string().nullable().optional(),
  lang: z.string(),
  tag: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  chunks: z.array(chunkDebugSchema),
})
export type ChatDebugDoc = z.infer<typeof chatDebugDocSchema>

// ─── Session Turn & Debug ─────────────────────────────────────────────────
export const sessionChunkSchema = z.object({
  id: z.string().uuid(),
  document_id: z.string().uuid(),
  content: z.string(),
  score: z.number(),
})
export type SessionChunk = z.infer<typeof sessionChunkSchema>

export const sessionTurnSchema = z.object({
  query: z.string(),
  response: z.string(),
  timestamp: z.string(),
  chunks: z.array(sessionChunkSchema),
})
export type SessionTurn = z.infer<typeof sessionTurnSchema>

export const sessionDebugSchema = z.object({
  session_id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  turns: z.array(sessionTurnSchema),
})
export type SessionDebug = z.infer<typeof sessionDebugSchema>

// ─── Chat Debug (full debug payload from stream) ──────────────────────────
export const chatDebugSchema = z.object({
  documents: z.array(chatDebugDocSchema),
  session: sessionDebugSchema,
})
export type ChatDebug = z.infer<typeof chatDebugSchema>

// ─── Session History Response (GET /chat/{session_id}) ────────────────────
export const sessionTurnResponseSchema = z.object({
  query: z.string(),
  response: z.string(),
  timestamp: z.string(),
})
export type SessionTurnResponse = z.infer<typeof sessionTurnResponseSchema>

export const sessionResponseSchema = z.object({
  session_id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  turns: z.array(sessionTurnResponseSchema),
})
export type SessionResponse = z.infer<typeof sessionResponseSchema>

// ─── Stream Event ─────────────────────────────────────────────────────────
export const streamEventSchema = z.object({
  session_id: z.string().uuid().optional(),
  content: z.string().optional(),
  debug: chatDebugSchema.optional(),
})
export type StreamEvent = z.infer<typeof streamEventSchema>

// ─── Chat Messages ────────────────────────────────────────────────────────
export const messageRoleSchema = z.enum(['user', 'assistant'])
export type MessageRole = z.infer<typeof messageRoleSchema>

export const chatMessageSchema = z.object({
  role: messageRoleSchema,
  content: z.string(),
  debug: chatDebugSchema.optional(),
})
export type ChatMessage = z.infer<typeof chatMessageSchema>
