import { z } from 'zod'

export const languageEnum = z.enum(['AR', 'FR', 'EN'])
export type Language = z.infer<typeof languageEnum>

export const jobStatusEnum = z.enum(['PENDING', 'STARTED', 'SUCCESS', 'FAILURE'])
export type JobStatusValue = z.infer<typeof jobStatusEnum>

export const filterRuleTypeEnum = z.enum(['url', 'domain', 'seo', 'relevance'])
export type FilterRuleType = z.infer<typeof filterRuleTypeEnum>

export const thresholdTypeEnum = z.enum(['fixed', 'dynamic'])
export type ThresholdType = z.infer<typeof thresholdTypeEnum>

export const filterRuleSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('url'),
    patterns: z.array(z.string()),
    reverse: z.boolean(),
  }),
  z.object({
    type: z.literal('domain'),
    allowed: z.array(z.string()),
    blocked: z.array(z.string()),
  }),
  z.object({
    type: z.literal('seo'),
    keywords: z.array(z.string()),
    threshold: z.number(),
  }),
  z.object({
    type: z.literal('relevance'),
    query: z.string(),
    threshold: z.number(),
  }),
])
export type FilterRule = z.infer<typeof filterRuleSchema>

export const crawlingConfigSchema = z.object({
  max_depth: z.number().int().min(1).max(10),
  max_pages: z.number().int().min(1).max(1000),
  filters: z.array(filterRuleSchema),
})
export type CrawlingConfig = z.infer<typeof crawlingConfigSchema>

export const filteringConfigSchema = z.object({
  word_count_threshold: z.number().int().min(0),
  languages: z.array(languageEnum).nullable(),
})
export type FilteringConfig = z.infer<typeof filteringConfigSchema>

export const formatingConfigSchema = z.object({
  user_query: z.string().nullable(),
  min_word_threshold: z.number().int().min(0),
  threshold_type: z.enum(['fixed', 'dynamic']),
  threshold: z.number().min(0).max(1),
  ignore_links: z.boolean(),
  ignore_images: z.boolean(),
  skip_internal_links: z.boolean(),
  excluded_tags: z.array(z.string()),
})
export type FormatingConfig = z.infer<typeof formatingConfigSchema>

export const jobConfigSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  crawling: crawlingConfigSchema.optional(),
  filtering: filteringConfigSchema,
  formating: formatingConfigSchema,
})
export type JobConfigInput = z.infer<typeof jobConfigSchema>

export const jobPageResultSchema = z.object({
  url: z.string(),
  title: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  error: z.string().nullable().optional(),
})
export type JobPageResult = z.infer<typeof jobPageResultSchema>

export const jobSummarySchema = z.object({
  total: z.number().int(),
  succeeded: z.number().int(),
  failed: z.number().int(),
  skipped: z.number().int(),
})
export type JobSummary = z.infer<typeof jobSummarySchema>

export const jobResultSchema = z.object({
  failed: z.array(jobPageResultSchema),
  skipped: z.array(jobPageResultSchema),
  summary: jobSummarySchema,
})
export type JobResult = z.infer<typeof jobResultSchema>

export const jobSchema = z.object({
  id: z.string().uuid(),
  task_id: z.string().nullable().optional(),
  workspace_id: z.string().uuid(),
  status: jobStatusEnum,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  config: jobConfigSchema.nullable().optional(),
  result: jobResultSchema.nullable().optional(),
})
export type Job = z.infer<typeof jobSchema>

export const paginatedJobsSchema = z.object({
  items: z.array(jobSchema),
  total: z.number().int(),
  skip: z.number().int(),
  limit: z.number().int(),
})
export type PaginatedJobs = z.infer<typeof paginatedJobsSchema>
