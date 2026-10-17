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

const coreActions: ViewAction[] = [
  'view:watch-floor', 'view:feed-wall', 'view:incidents', 'view:archive', 'view:reports',
]
const allActions: ViewAction[] = [...coreActions, 'view:zones-rules', 'view:models', 'view:users-audit']
type ModelAction = 'models:request-promotion' | 'models:record-approval' | 'models:request-class'
export type Action = ViewAction | ModelAction | 'demo:reset'
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
  if (action === 'demo:reset') return user.role === 'supervisor' || user.role === 'administrator'
  const actions: readonly Action[] = [...roleActions[user.role], ...modelActions[user.role]]
  return actions.includes(action)
}
