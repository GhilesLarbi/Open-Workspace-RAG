// dashboard/src/app/(dashboard)/[slug]/chat/_types/index.ts

export type MessageRole = "user" | "assistant";

/**
 * Represents a single chunk of a document used for debugging.
 */
export interface DebugChunk {
  id: string; // UUID
  chunk_index: number;
  content: string;
  db_score: number | null;
}

/**
 * Represents a source document with its chunks, for debugging.
 */
export interface DocumentDebug {
  id: string; // UUID
  workspace_id: string; // UUID
  is_approved: boolean;
  url: string;
  title: string | null;
  lang: string;
  tags: string[];
  suggestions: string[];
  created_at: string;
  updated_at: string;
  chunks: DebugChunk[];
}

/**
 * Represents a single message in the chat interface.
 */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
  debug?: DocumentDebug[]; 
}

/**
 * Represents the structure of a single data packet from the SSE stream.
 */
export interface SSEStreamPayload {
  content: string;
  debug?: DocumentDebug[];
}