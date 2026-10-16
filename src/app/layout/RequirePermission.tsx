import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../features/auth'
import { can } from '../../lib/permissions'
import type { ViewAction } from '../../lib/permissions'

export function RequirePermission({ action, children }: { action: ViewAction; children: ReactNode }) {
  const user = useAuthStore((state) => state.user)
  return can(user, action) ? children : <Navigate to="/watch-floor" replace />
}
