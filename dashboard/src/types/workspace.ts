export interface Workspace {
  id: string;
  organization_id: string;
  name: string;
  url: string;
  slug: string;
  tags: string[];
}

export interface WorkspaceCreate {
  name: string;
  url: string;
  slug: string;
}

export interface WorkspaceUpdate {
  name?: string;
  url?: string;
  slug?: string;
}