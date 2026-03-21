import { z } from 'zod'

export const chunkDebugSchema = z.object({
  id: z.string().uuid(),
  chunk_index: z.number().int(),
  content: z.string(),
  db_score: z.number().nullable().optional(),
})
export type ChunkDebug = z.infer<typeof chunkDebugSchema>

export const chatDebugDocSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  is_approved: z.boolean(),
  url: z.string(),
  title: z.string().nullable().optional(),
  lang: z.string(),
  tags: z.array(z.string()),
  suggestions: z.array(z.string()),
  created_at: z.string(),
  updated_at: z.string(),
  chunks: z.array(chunkDebugSchema),
})
export type ChatDebugDoc = z.infer<typeof chatDebugDocSchema>

export const streamEventSchema = z.object({
  content: z.string(),
  debug: z.array(chatDebugDocSchema).optional(),
})
export type StreamEvent = z.infer<typeof streamEventSchema>

export const messageRoleSchema = z.enum(['user', 'assistant'])
export type MessageRole = z.infer<typeof messageRoleSchema>

export const chatMessageSchema = z.object({
  role: messageRoleSchema,
  content: z.string(),
  debug: z.array(chatDebugDocSchema).optional(),
})
export type ChatMessage = z.infer<typeof chatMessageSchema>
