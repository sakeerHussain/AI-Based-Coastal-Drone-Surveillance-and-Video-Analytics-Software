export type Role = 'operator' | 'analyst' | 'supervisor' | 'administrator'

export type ViewAction =
  | 'view:watch-floor'
  | 'view:feed-wall'
  | 'view:incidents'
  | 'view:zones-rules'
  | 'view:models'

const coreActions: ViewAction[] = [
  'view:watch-floor', 'view:feed-wall', 'view:incidents',
]
const allActions: ViewAction[] = [...coreActions, 'view:zones-rules', 'view:models']
type ModelAction = 'models:request-promotion' | 'models:record-approval' | 'models:request-class'
export type Action = ViewAction | ModelAction
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
  const actions: readonly Action[] = [...roleActions[user.role], ...modelActions[user.role]]
  return actions.includes(action)
}
