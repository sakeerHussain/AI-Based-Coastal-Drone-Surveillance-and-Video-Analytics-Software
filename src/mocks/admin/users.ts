import type { AdminUser } from '../../features/admin'
import { mockUser } from '../auth'

export const adminUsers: AdminUser[] = [
  { ...mockUser, status: 'Active' },
  { name: 'A. Pillai', policeId: 'KP-DEMO-1001', role: 'administrator', status: 'Active' },
  { name: 'R. Nair', policeId: 'KP-DEMO-1002', role: 'operator', status: 'Active' },
  { name: 'S. Thomas', policeId: 'KP-DEMO-1003', role: 'analyst', status: 'Active' },
  { name: 'P. Kumar', policeId: 'KP-DEMO-1004', role: 'operator', status: 'Suspended' },
]
