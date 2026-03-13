import { z } from 'zod'

export type JobStatus = 'SUCCESS' | 'PENDING' | 'STARTED' | 'FAILURE'

export const FilterRuleSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('url'),
    patterns: z.array(z.string()).default([]),
    reverse: z.boolean().default(false),
  }),
  z.object({
    type: z.literal('domain'),
    allowed: z.array(z.string()).default([]),
    blocked: z.array(z.string()).default([]),
  }),
  z.object({
    type: z.literal('seo'),
    keywords: z.array(z.string()).default([]),
    threshold: z.number().default(0.5),
  }),
  z.object({
    type: z.literal('relevance'),
    query: z.string().default(''),
    threshold: z.number().default(0.7),
  }),
])

export const JobConfigSchema = z.object({
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  crawling: z.object({
    max_depth: z.number().int().min(1).default(1),
    max_pages: z.number().int().min(1).default(10),
    filters: z.array(FilterRuleSchema).default([]),
  }),
  filtering: z.object({
    word_count_threshold: z.number().int().min(0).default(0),
    languages: z.array(z.enum(['AR', 'FR', 'EN'])).nullable().default(null),
  }),
  formating: z.object({
    user_query: z.string().nullable().default(null),
    min_word_threshold: z.number().int().default(5),
    threshold_type: z.enum(['fixed', 'dynamic']).default('fixed'),
    threshold: z.number().min(0).max(1).default(0.2),
    ignore_links: z.boolean().default(true),
    ignore_images: z.boolean().default(true),
    skip_internal_links: z.boolean().default(true),
  }),
})

export type JobConfig = z.infer<typeof JobConfigSchema>

export type Job = {
  id: string
  task_id: string | null
  status: JobStatus
  config: JobConfig
  result: Record<string, unknown> | null
  workspace_id: string
  created_at: Date
  updated_at: Date
}


export type JobResult = {
  summary: {
    total: number
    failed: number
    succeeded: number
  }
  failed_pages: Array<{
    url: string
    error: string
    status: string
  }>
  success_pages: Array<{
    url: string
    lang: string
    title: string
    doc_id: string
  }>
}