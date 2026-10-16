export type Role = 'operator' | 'analyst' | 'supervisor' | 'administrator'

export function can(user: { role: Role }, action: string): boolean {
  // TODO: Enforce permissions based on the user's role and requested action.
  void user
  void action
  return true
}
