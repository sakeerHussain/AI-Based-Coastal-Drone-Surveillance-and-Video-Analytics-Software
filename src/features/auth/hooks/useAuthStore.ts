import { create } from 'zustand'
import type { Role } from '../../../lib/permissions'
import { mockUser } from '../../../mocks/auth'
import type { AuthUser } from '../types'

interface AuthState {
  user: AuthUser | null
  signIn: (role: Role, policeId?: string) => void
  signOut: () => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  signIn: (role, policeId = mockUser.policeId) => set({ user: { ...mockUser, policeId, role } }),
  signOut: () => set({ user: null }),
  reset: () => set({ user: null }),
}))
