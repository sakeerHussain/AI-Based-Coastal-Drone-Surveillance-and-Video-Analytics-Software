import { create } from 'zustand'
import { useAuthStore } from '../../auth'
import { can } from '../../../lib/permissions'
import { useAuditStore } from '../../../lib/useAuditStore'
import { adminUserSchema, type AdminData, type AdminUser, type UserSaveResult } from '../types'

interface AdminState {
  users: AdminUser[]
  loaded: boolean
  hydrate: (data: AdminData) => void
  saveUser: (input: AdminUser, originalId?: string) => UserSaveResult
  reset: () => void
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [], loaded: false,
  reset: () => set({ users: [], loaded: false }),
  hydrate: (data) => {
    if (get().loaded) return
    const actor = useAuthStore.getState().user
    const users = structuredClone(data.users)
    if (actor) {
      const index = users.findIndex((user) => user.policeId.toUpperCase() === actor.policeId.toUpperCase())
      const current: AdminUser = { ...actor, policeId: actor.policeId.toUpperCase(), status: 'Active' }
      if (index < 0) users.unshift(current)
      else users[index] = current
    }
    set({ users, loaded: true })
  },
  saveUser: (input, originalId) => {
    const actor = useAuthStore.getState().user
    if (!can(actor, 'users:manage')) return { ok: false, message: 'Only administrators can manage users.' }
    if (!get().loaded) return { ok: false, message: 'Wait for the user directory to load.' }
    const parsed = adminUserSchema.safeParse(input)
    if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message }
    const next = parsed.data
    const users = get().users
    const previous = originalId ? users.find((user) => user.policeId === originalId) : undefined
    if (originalId && !previous) return { ok: false, message: 'This user no longer exists. Refresh the directory.' }
    if (previous && previous.policeId !== next.policeId) return { ok: false, message: 'An existing police ID cannot be changed.' }
    if (users.some((user) => user.policeId.toUpperCase() === next.policeId && user !== previous)) {
      return { ok: false, message: 'A user with this police ID already exists.' }
    }
    const self = next.policeId === actor!.policeId.toUpperCase()
    if (self && next.status === 'Suspended') return { ok: false, message: 'You cannot suspend your own account.' }
    if (previous?.role === 'administrator' && previous.status === 'Active'
      && (next.role !== 'administrator' || next.status !== 'Active')
      && !users.some((user) => user !== previous && user.role === 'administrator' && user.status === 'Active')) {
      return { ok: false, message: 'Keep at least one active administrator.' }
    }
    if (previous && Object.keys(next).every((key) => next[key as keyof AdminUser] === previous[key as keyof AdminUser])) return { ok: true, changed: false }
    useAuditStore.getState().record({
      actor: actor!.name, entityId: next.policeId,
      action: previous ? 'User updated' : 'User created',
      before: previous ? { ...previous } : null, after: { ...next },
    })
    set({ users: previous ? users.map((user) => user === previous ? next : user) : [...users, next] })
    if (self) useAuthStore.setState({ user: { name: next.name, policeId: actor!.policeId, role: next.role } })
    return { ok: true, changed: true }
  },
}))
