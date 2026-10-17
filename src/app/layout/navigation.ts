import type { ViewAction } from '../../lib/permissions'

export const navigationItems: { path: string; label: string; action: ViewAction; secondary?: boolean }[] = [
  { path: '/watch-floor', label: 'Watch floor', action: 'view:watch-floor' },
  { path: '/feed-wall', label: 'Feed wall', action: 'view:feed-wall' },
  { path: '/incidents', label: 'Incidents', action: 'view:incidents' },
  { path: '/zones-rules', label: 'Zones and rules', action: 'view:zones-rules' },
  { path: '/models', label: 'Models and health', action: 'view:models' },
  { path: '/video-sources', label: 'Video sources', action: 'view:video-sources', secondary: true },
  { path: '/fleet', label: 'Drone fleet and missions', action: 'view:fleet', secondary: true },
  { path: '/archive', label: 'Archive and playback', action: 'view:archive', secondary: true },
  { path: '/reports', label: 'Reports', action: 'view:reports', secondary: true },
  { path: '/users-audit', label: 'Users and audit', action: 'view:users-audit', secondary: true },
]
