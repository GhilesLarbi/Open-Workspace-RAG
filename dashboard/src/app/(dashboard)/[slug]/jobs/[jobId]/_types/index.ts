export interface CrawledPage {
  url: string;
  doc_id: string;
  title: string;
  lang: string;
}

export interface FailedPage {
  url: string;
  error: string;
  status: "crawler_error" | "filter_excluded" | "timeout" | string;
}

export interface IgnoredPage {
  url: string;
  title: string;
  reason: string;
}

export interface JobResult {
  summary: {
    total: number;
    succeeded: number;
    failed: number;
    ignored?: number;
  };
  pages?: CrawledPage[];
  failed_pages?: FailedPage[];
  ignored_pages?: IgnoredPage[];
}