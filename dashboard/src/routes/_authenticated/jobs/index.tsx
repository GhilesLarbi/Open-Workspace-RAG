import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { jobStatuses } from '@/features/jobs/data/data'
import { JobsIndex } from '@/features/jobs/index'

const jobsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(z.enum(jobStatuses.map((s) => s.value)))
    .optional()
    .catch([]),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/jobs/')({
  validateSearch: jobsSearchSchema,
  component: JobsIndex,
})
