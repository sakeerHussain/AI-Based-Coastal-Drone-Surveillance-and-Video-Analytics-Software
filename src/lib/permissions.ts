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
const roleActions: Record<Role, readonly ViewAction[]> = {
  operator: coreActions,
  analyst: [...coreActions, 'view:zones-rules'],
  supervisor: allActions,
  administrator: allActions,
}

export function can(user: { role: Role } | null, action: ViewAction): boolean {
  return user !== null && roleActions[user.role].includes(action)
}
