import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../features/auth'
import { SideNavigation } from './SideNavigation'
import { TopBar } from './TopBar'

export function AppShell() {
  const user = useAuthStore((state) => state.user)
  if (!user) return <Navigate to="/sign-in" replace />

  return (
    <div className="flex h-full overflow-hidden bg-paper font-sans text-ink">
      <SideNavigation />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="min-h-0 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
