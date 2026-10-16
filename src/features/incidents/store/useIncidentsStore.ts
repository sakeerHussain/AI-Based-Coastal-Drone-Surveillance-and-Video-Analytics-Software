import { create } from 'zustand'
import { currentTime } from '../../../lib/time'
import type { ActionRecord, IncidentAction, IncidentsData } from '../types'

interface IncidentsState {
  history: Record<string, ActionRecord[]>
  acknowledged: Record<string, boolean>
  toast: { id: string; text: string } | null
  loaded: boolean
  data: IncidentsData | null
  hydrate: (data: IncidentsData) => void
  reset: () => void
  recordAction: (incidentId: string, action: IncidentAction, person: string) => boolean
  dismissToast: () => void
}
export const useIncidentsStore = create<IncidentsState>((set, get) => ({
  history: {}, acknowledged: {}, toast: null, data: null, loaded: false,
  hydrate: (data) => {
    if (get().loaded) return
    set({ data, loaded: true, history: Object.fromEntries(Object.values(data.records)
      .map((incident) => [incident.id, structuredClone(incident.initialActions)])) })
  },
  reset: () => set({ history: {}, acknowledged: {}, toast: null, data: null, loaded: false }),
  dismissToast: () => set({ toast: null }),
  recordAction: (incidentId, action, person) => {
    const data = get().data
    if (!data || !Object.hasOwn(data.records, incidentId) || !person.trim()) return false
    const incident = data.records[incidentId]
    const definition = data.actions.find((item) => item.id === action)
    if (!definition) return false
    let accepted = false
    set((state) => {
      if (action === 'acknowledge' && state.acknowledged[incidentId]) return state
      accepted = true
      const text = definition.includeStation ? `${definition.record} ${incident.station}` : definition.record
      const entry: ActionRecord = { id: crypto.randomUUID(), createdAt: currentTime(), person, text }
      return {
        history: { ...state.history, [incidentId]: [...state.history[incidentId], entry] },
        acknowledged: action === 'acknowledge' ? { ...state.acknowledged, [incidentId]: true } : state.acknowledged,
        toast: { id: entry.id, text },
      }
    })
    return accepted
  },
}))
