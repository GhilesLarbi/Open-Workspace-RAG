import { createFileRoute } from '@tanstack/react-router'
import { WorkspacesSettings } from '@/features/settings/workspaces'

export const Route = createFileRoute('/_authenticated/settings/workspaces')({
  component: WorkspacesSettings,
})
