import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/auth-store'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { authApi } from '@/features/auth/auth-api'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const { accessToken, organization, setOrganization, reset } =
      useAuthStore.getState().auth
    const workspaceStore = useWorkspaceStore.getState()

    if (!accessToken) {
      throw redirect({ to: '/sign-in', search: { redirect: location.href } })
    }

    try {
      const [orgData, workspaces] = await Promise.all([
        organization ? Promise.resolve(organization) : authApi.getMe(),
        workspaceStore.initialize(),
      ])

      if (!organization) setOrganization(orgData)
      const isInSettings = location.pathname.startsWith('/settings')

      if (workspaces.length === 0 && !isInSettings) {
        throw redirect({ to: '/settings/workspaces' })
      }
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        ('isRedirect' in err || 'status' in err)
      ) {
        throw err
      }

      reset()
      throw redirect({ to: '/sign-in', search: { redirect: location.href } })
    }
  },
  component: AuthenticatedLayout,
})