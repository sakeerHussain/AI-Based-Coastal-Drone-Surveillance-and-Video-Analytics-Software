import { create } from 'zustand'
import type { Role } from '../../../lib/permissions'
import { mockUser } from '../../../mocks/auth'
import type { AuthUser } from '../types'

interface AuthState {
  user: AuthUser | null
  signIn: (role: Role) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: { ...mockUser },
  signIn: (role) => set({ user: { ...mockUser, role } }),
  signOut: () => set({ user: null }),
}))
