// src/app/(dashboard)/[slug]/jobs/_types/index.ts

export enum LanguageEnum {
  AR = "AR",
  FR = "FR",
  EN = "EN",
}

export const LANGUAGE_LABELS: Record<LanguageEnum, string> = {
  [LanguageEnum.AR]: "Arabic",
  [LanguageEnum.FR]: "French",
  [LanguageEnum.EN]: "English",
};

export type JobStatus = "PENDING" | "STARTED" | "SUCCESS" | "FAILURE";

export interface URLFilterRule {
  type: "url";
  patterns: string[];
  reverse: boolean;
}

export interface DomainFilterRule {
  type: "domain";
  allowed: string[];
  blocked: string[];
}

export interface SEOFilterRule {
  type: "seo";
  keywords: string[];
  threshold: number;
}

export interface RelevanceFilterRule {
  type: "relevance";
  query: string;
  threshold: number;
}

export type FilterRule =
  | URLFilterRule
  | DomainFilterRule
  | SEOFilterRule
  | RelevanceFilterRule;

export interface CrawlingConfig {
  max_depth: number;
  max_pages: number;
  filters: FilterRule[];
}

export interface FilteringConfig {
  word_count_threshold: number;
  languages: LanguageEnum[] | null;
}

export interface FormatingConfig {
  user_query: string | null;
  min_word_threshold: number;
  threshold_type: "fixed" | "dynamic";
  threshold: number;
  ignore_links: boolean;
  ignore_images: boolean;
  skip_internal_links: boolean;
}

export interface JobConfig {
  url: string;
  crawling: CrawlingConfig | null;
  filtering: FilteringConfig;
  formating: FormatingConfig;
}

export interface Job {
  id: string;
  workspace_id: string;
  task_id: string | null;
  status: JobStatus;
  payload: JobConfig;
  result: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// Matches backend PaginatedResponse[T]
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface JobCreateResponse {
  job_id: string;
  task_id: string | null;
  status: JobStatus;
}

export interface JobDeleteResponse {
  detail: string;
}