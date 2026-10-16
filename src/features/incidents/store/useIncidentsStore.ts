import { create } from 'zustand'
import { currentTime } from '../../../lib/time'
import { incidentRecords } from '../../../mocks/incidents/records'
import { incidentActions } from '../../../mocks/incidents/actions'
import type { ActionRecord, IncidentAction } from '../types'

interface IncidentsState {
  history: Record<string, ActionRecord[]>
  acknowledged: Record<string, boolean>
  toast: { id: string; text: string } | null
  recordAction: (incidentId: string, action: IncidentAction, person: string) => boolean
  dismissToast: () => void
}
export const useIncidentsStore = create<IncidentsState>((set) => ({
  history: Object.fromEntries(Object.values(incidentRecords).map((incident) => [incident.id, incident.initialActions])),
  acknowledged: {}, toast: null,
  dismissToast: () => set({ toast: null }),
  recordAction: (incidentId, action, person) => {
    if (!Object.hasOwn(incidentRecords, incidentId) || !person.trim()) return false
    const incident = incidentRecords[incidentId]
    const definition = incidentActions.find((item) => item.id === action)
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
