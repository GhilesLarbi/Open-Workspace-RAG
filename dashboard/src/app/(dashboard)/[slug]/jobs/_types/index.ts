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
  excluded_tags: string[];
}

export interface JobConfig {
  url: string;
  crawling: CrawlingConfig | null;
  filtering: FilteringConfig;
  formating: FormatingConfig;
}

export interface JobPageResult {
    url: string
    title: string | null
    reason: string | null
    error: string | null
}


export interface JobSummary {
    total: number
    succeeded: number
    failed: number
    skipped: number

}

export interface JobResult {
  failed: JobPageResult[],
  skipped: JobPageResult[],
  summary: JobSummary,
}

export interface Job {
  id: string;
  workspace_id: string;
  task_id: string | null;
  status: JobStatus;
  config: JobConfig;
  result: JobResult | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface JobDeleteResponse {
  detail: string;
}