export type LanguageEnum = "AR" | "FR" | "EN";
export type JobDocumentAction = "CREATED" | "UPDATED";

export interface Chunk {
  id: string;
  chunk_index: number;
  content: string;
}

export interface Document {
  id: string;
  workspace_id: string;
  is_approved: boolean;
  url: string;
  title: string | null;
  lang: LanguageEnum;
  tags: string[];
  suggestions: string[];
  created_at: string;
  updated_at: string;
}

export interface DocumentWithChunks extends Document {
  chunks: Chunk[];
}

export interface PaginatedDocumentResponse {
  items: Document[];
  total: number;
  skip: number;
  limit: number;
}