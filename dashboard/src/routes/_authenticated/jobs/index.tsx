import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Jobs } from '@/features/jobs'

const jobsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(
      z.union([
        z.literal('PENDING'),
        z.literal('STARTED'),
        z.literal('SUCCESS'),
        z.literal('FAILURE'),
      ])
    )
    .optional()
    .catch([]),
})

export const Route = createFileRoute('/_authenticated/jobs/')({
  validateSearch: jobsSearchSchema,
  component: Jobs,
})
