import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { DocumentsProvider } from '@/features/documents/components/documents-provider'
import Documents from '@/features/documents'

const documentSearchSchema = z.object({
  page: z.coerce.number().optional().default(1),
  pageSize: z.coerce.number().optional().default(10),
  q: z.string().optional(),
  is_approved: z.array(z.string()).optional(),
  lang: z.array(z.string()).optional(),
  job_ids: z.array(z.string().uuid()).optional(),
})

export const Route = createFileRoute('/_authenticated/documents/')({
  validateSearch: documentSearchSchema,
  component: () => (
    <DocumentsProvider>
      <Documents />
    </DocumentsProvider>
  ),
})
