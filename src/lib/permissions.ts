export type Role = 'operator' | 'analyst' | 'supervisor' | 'administrator'

export type ViewAction =
  | 'view:watch-floor'
  | 'view:feed-wall'
  | 'view:incidents'
  | 'view:zones-rules'
  | 'view:models'
  | 'view:archive'
  | 'view:reports'
  | 'view:users-audit'
  | 'view:video-sources'
  | 'view:fleet'

const coreActions: ViewAction[] = [
  'view:watch-floor', 'view:feed-wall', 'view:incidents', 'view:archive', 'view:reports', 'view:video-sources', 'view:fleet',
]
const allActions: ViewAction[] = [...coreActions, 'view:zones-rules', 'view:models', 'view:users-audit']
type ModelAction = 'models:request-promotion' | 'models:record-approval' | 'models:request-class'
export type Action = ViewAction | ModelAction | 'demo:reset' | 'users:manage' | 'sources:manage'
const modelActions: Record<Role, readonly ModelAction[]> = {
  operator: [], analyst: [],
  supervisor: ['models:request-promotion', 'models:request-class'],
  administrator: ['models:request-promotion', 'models:request-class', 'models:record-approval'],
}
const roleActions: Record<Role, readonly ViewAction[]> = {
  operator: coreActions,
  analyst: [...coreActions, 'view:zones-rules'],
  supervisor: allActions,
  administrator: allActions,
}

export function can(user: { role: Role } | null, action: Action): boolean {
  if (!user) return false
  if (action === 'users:manage') return user.role === 'administrator'
  if (action === 'sources:manage') return user.role === 'supervisor' || user.role === 'administrator'
  if (action === 'demo:reset') return user.role === 'supervisor' || user.role === 'administrator'
  const actions: readonly Action[] = [...roleActions[user.role], ...modelActions[user.role]]
  return actions.includes(action)
}

export const permissionLabels: { action: Action; label: string }[] = [
  { action: 'view:watch-floor', label: 'View Watch floor' },
  { action: 'view:feed-wall', label: 'View Feed wall' },
  { action: 'view:incidents', label: 'View incidents and playback' },
  { action: 'view:zones-rules', label: 'View Zones and rules' },
  { action: 'view:models', label: 'View Models and health' },
  { action: 'view:archive', label: 'View Archive and playback' },
  { action: 'view:reports', label: 'View Reports' },
  { action: 'view:users-audit', label: 'View Users and audit' },
  { action: 'view:video-sources', label: 'View Video sources' },
  { action: 'view:fleet', label: 'View Drone fleet and missions' },
  { action: 'sources:manage', label: 'Configure sources and simulate imports' },
  { action: 'models:request-promotion', label: 'Request model promotion' },
  { action: 'models:record-approval', label: 'Record authority approval' },
  { action: 'models:request-class', label: 'Request dataset classes' },
  { action: 'users:manage', label: 'Manage demo users' },
  { action: 'demo:reset', label: 'Reset demo' },
]
