import type { AuthUser } from '../features/auth'

export const mockUser: AuthUser = {
  name: 'N. Menon',
  policeId: 'KP-CP-20418',
  role: 'supervisor',
}
export const demoCredentials = { policeId: mockUser.policeId, password: 'demo-password', code: '481592' }
export const demoRoles = [
  { value: 'operator', label: 'Operator' }, { value: 'analyst', label: 'Analyst' },
  { value: 'supervisor', label: 'Supervisor' }, { value: 'administrator', label: 'Administrator' },
] as const
