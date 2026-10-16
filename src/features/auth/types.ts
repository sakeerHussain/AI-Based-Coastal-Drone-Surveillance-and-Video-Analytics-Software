import type { Role } from '../../lib/permissions'

export interface AuthUser {
  name: string
  policeId: string
  role: Role
}
