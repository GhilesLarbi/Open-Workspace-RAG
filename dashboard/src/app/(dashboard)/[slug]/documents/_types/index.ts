
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
  lang: string;
  tags: string[];
  suggestions: string[];
  created_at: string;
  updated_at: string;
  chunks: Chunk[];
}