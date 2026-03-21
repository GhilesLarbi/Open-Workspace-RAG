import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate()
  const accessToken = useAuthStore((state) => state.accessToken)
  const reset = useAuthStore((state) => state.reset)

  useEffect(() => {
    if (!accessToken) {
      const redirect = `${window.location.href}`
      reset()
      navigate({ to: '/sign-in', search: { redirect }, replace: true })
    }
  }, [accessToken, navigate, reset])

  if (!accessToken) {
    return (
      <div className='flex h-svh w-full items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return <>{children}</>
}
