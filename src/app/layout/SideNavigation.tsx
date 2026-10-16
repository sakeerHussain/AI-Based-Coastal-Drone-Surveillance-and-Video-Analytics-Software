import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../features/auth'
import { can } from '../../lib/permissions'
import { navigationItems } from './navigation'

export function SideNavigation() {
  const user = useAuthStore((state) => state.user)

  return (
    <nav aria-label="Main navigation" className="hidden w-52 shrink-0 flex-col border-r border-line bg-panel py-4 md:flex">
      <div className="px-5 pb-5">
        <div className="text-[15px] font-bold leading-tight">Coastal Watch</div>
        <div className="text-xs text-mute">Kerala Police</div>
      </div>
      {navigationItems.filter((item) => can(user, item.action)).map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `border-l-4 px-5 py-2 text-left text-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sea ${
              isActive ? 'border-sea bg-shoal font-semibold' : 'border-transparent text-mute hover:text-ink'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
      <div className="mt-3 px-5 py-1 text-sm text-mute">Archive and playback</div>
      <div className="px-5 py-1 text-sm text-mute">Reports</div>
      <div className="px-5 py-1 text-sm text-mute">Users and audit</div>
      <div className="mt-auto px-5 text-xs text-mute">Demo data only</div>
    </nav>
  )
}
