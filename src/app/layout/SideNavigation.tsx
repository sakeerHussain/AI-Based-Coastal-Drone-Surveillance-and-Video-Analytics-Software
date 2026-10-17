import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../features/auth'
import { can } from '../../lib/permissions'
import { navigationItems } from './navigation'
import { SidebarIcon } from './SidebarIcon'

const sidebarStorageKey = 'coastal-watch.sidebar-collapsed'

export function SideNavigation() {
  const user = useAuthStore((state) => state.user)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem(sidebarStorageKey) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(sidebarStorageKey, String(collapsed))
    } catch {
      // Keep the toggle usable when browser storage is unavailable.
    }
  }, [collapsed])

  const rowLayout = collapsed ? 'justify-center px-3' : 'gap-3 px-4'

  return (
    <nav
      aria-label="Main navigation"
      className={`hidden shrink-0 flex-col overflow-y-auto border-r border-line bg-paper md:flex ${collapsed ? 'w-16' : 'w-52'}`}
    >
      <div className={`flex min-h-22 items-center border-b border-line ${collapsed ? 'justify-center px-2' : 'justify-between gap-2 px-4'}`}>
        <div className={collapsed ? 'sr-only' : ''}>
          <div className="text-base font-bold leading-tight tracking-tight">Coastal Watch</div>
          <div className="mt-1 text-xs text-mute">Kerala Police</div>
        </div>
        <button
          type="button"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          aria-controls="sidebar-items"
          onClick={() => setCollapsed((value) => !value)}
          className="flex size-8 shrink-0 items-center justify-center rounded border border-line bg-panel text-mute hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea"
        >
          <SidebarIcon name={collapsed ? 'expand' : 'collapse'} />
        </button>
      </div>
      <div id="sidebar-items" className="flex flex-1 flex-col">
        {[false, true].map((secondary) => <div key={String(secondary)} className={`space-y-1 py-5 ${secondary ? 'border-t border-line' : ''}`}>
          {navigationItems.filter((item) => !!item.secondary === secondary && can(user, item.action)).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center border-y py-3 text-left text-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sea ${rowLayout} ${
                  isActive
                    ? 'border-line bg-shoal font-semibold text-ink'
                    : 'border-transparent text-mute hover:bg-panel hover:text-ink'
                }`
              }
            >
              <SidebarIcon name={item.path} />
              <span className={collapsed ? 'sr-only' : ''}>{item.label}</span>
            </NavLink>
          ))}
        </div>)}
        <div className="mt-auto border-t border-line py-4">
          <div title={collapsed ? 'Demo data only' : undefined} className={`flex items-center text-xs text-mute ${rowLayout}`}>
            <SidebarIcon name="Demo data only" />
            <span className={collapsed ? 'sr-only' : ''}>Demo data only</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
