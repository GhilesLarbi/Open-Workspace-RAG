import { createFileRoute } from '@tanstack/react-router'
import {SettingsOrganization } from '@/features/settings/organization'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsOrganization,
})
