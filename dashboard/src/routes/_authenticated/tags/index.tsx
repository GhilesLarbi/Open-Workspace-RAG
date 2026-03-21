import { createFileRoute } from '@tanstack/react-router'
import { TagsView } from '@/features/tags/tags-view'

export const Route = createFileRoute('/_authenticated/tags/')({
  component: TagsView,
})
