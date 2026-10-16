import { create } from 'zustand'
import { defaultRule } from '../../../mocks/zones-rules/fixtures'
import { useAuditStore } from '../../../lib/useAuditStore'
import { currentTime } from '../../../lib/time'
import { validateRule } from '../ruleSchema'
import type { ChartPosition } from '../../../components/chart'
import type { Rule, Zone, ZoneType, ZonesRulesData } from '../types'

interface ZonesRulesState extends ZonesRulesData {
  reset: () => void
  loaded: boolean
  selectedId: string
  drafts: Record<string, Rule>
  savedAt: Record<string, number>
  toast: string | null
  hydrate: (data: ZonesRulesData) => void
  select: (id: string) => void
  editRule: (id: string, patch: Partial<Rule>) => void
  saveRule: (id: string, actor: string) => boolean
  addZone: (name: string, type: ZoneType, points: ChartPosition[]) => void
  reshape: (id: string, points: ChartPosition[]) => void
  dismissToast: () => void
}
const tones = { 'Restricted area': 'red', 'Crowd monitoring': 'amber', 'Harbour monitoring': 'sea' } as const
export const useZonesRulesStore = create<ZonesRulesState>((set, get) => ({
  reset: () => set(useZonesRulesStore.getInitialState(), true),
  zones: [], rules: {}, drafts: {}, savedAt: {}, loaded: false, selectedId: '', toast: null,
  hydrate: (data) => {
    if (get().loaded) return
    set({ ...structuredClone(data), drafts: structuredClone(data.rules), loaded: true, selectedId: data.zones[0].id })
  },
  select: (selectedId) => set({ selectedId }),
  editRule: (id, patch) => set((state) => ({ drafts: { ...state.drafts, [id]: { ...state.drafts[id], ...patch } } })),
  saveRule: (id, actor) => {
    const state = get()
    const rule = state.drafts[id]
    if (!rule || !actor.trim() || Object.keys(validateRule(rule, state.zones.map((zone) => zone.id))).length) return false
    const saved = { ...rule }
    useAuditStore.getState().record({
      actor, action: 'Rule saved', entityId: id,
      before: state.rules[id] ? { ...state.rules[id] } : null, after: { ...saved },
    })
    set({ rules: { ...state.rules, [id]: saved }, savedAt: { ...state.savedAt, [id]: currentTime() },
      toast: `Rule for ${id} saved. Change logged in audit.` })
    return true
  },
  addZone: (name, type, points) => set((state) => {
    const number = Math.max(0, ...state.zones.map((zone) => Number(zone.id.slice(2)))) + 1
    const id = `Z-${String(number).padStart(2, '0')}`
    const zone: Zone = { id, name, type, tone: tones[type], points }
    return { zones: [...state.zones, zone], selectedId: id,
      drafts: { ...state.drafts, [id]: { ...defaultRule, zoneId: id } } }
  }),
  reshape: (id, points) => set((state) => ({ zones: state.zones.map((zone) => zone.id === id ? { ...zone, points } : zone) })),
  dismissToast: () => set({ toast: null }),
}))
