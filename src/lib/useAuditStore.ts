import { create } from 'zustand'
import { currentTime } from './time'
import type { AuditEntry } from './auditTypes'

interface AuditState {
  reset: () => void
  entries: AuditEntry[]
  record: (entry: Omit<AuditEntry, 'id' | 'createdAt'>) => void
}
export const useAuditStore = create<AuditState>((set) => ({
  reset: () => set({ entries: [] }),
  entries: [],
  record: (entry) => set((state) => ({
    entries: [...state.entries, { ...structuredClone(entry), id: crypto.randomUUID(), createdAt: currentTime() }],
  })),
}))
