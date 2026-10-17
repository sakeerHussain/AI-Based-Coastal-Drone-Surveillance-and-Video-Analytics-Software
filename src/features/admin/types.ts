import { z } from 'zod'

export const adminUserSchema = z.object({
  name: z.string().trim().min(2, 'Enter at least two characters.').max(80, 'Use 80 characters or fewer.'),
  policeId: z.string().trim().toUpperCase().min(1, 'Enter a police ID.')
    .max(40, 'Use 40 characters or fewer.').regex(/^[A-Z0-9-]+$/, 'Use letters, numbers and hyphens only.'),
  role: z.enum(['operator', 'analyst', 'supervisor', 'administrator']),
  status: z.enum(['Active', 'Suspended']),
})

export type AdminUser = z.infer<typeof adminUserSchema>
export interface AdminData { users: AdminUser[] }
export type UserSaveResult = { ok: true; changed: boolean } | { ok: false; message: string }
