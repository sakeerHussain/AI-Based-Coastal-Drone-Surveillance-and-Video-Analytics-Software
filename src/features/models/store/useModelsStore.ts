import { create } from 'zustand'
import { can } from '../../../lib/permissions'
import { useAuditStore } from '../../../lib/useAuditStore'
import type { AuthUser } from '../../auth'
import type { ModelRecord, ModelsData } from '../types'

interface ModelsState {
  reset: () => void
  models: ModelRecord[]
  loaded: boolean
  selectedId: string
  requestedClasses: string[]
  pendingClasses: string[]
  toast: string | null
  hydrate: (data: ModelsData) => void
  select: (id: string) => void
  registerCandidate: (model: ModelRecord, authorizedBy: AuthUser | null) => void
  requestPromotion: (user: AuthUser | null) => void
  approve: (user: AuthUser | null) => void
  requestClass: (name: string, user: AuthUser | null) => void
  dismissToast: () => void
}
export const useModelsStore = create<ModelsState>((set, get) => ({
  reset: () => set(useModelsStore.getInitialState(), true),
  models: [], loaded: false, selectedId: '', requestedClasses: [], pendingClasses: [], toast: null,
  hydrate: (data) => {
    if (get().loaded) return
    set({ models: structuredClone(data.models), pendingClasses: [...data.dataset.pendingClasses], loaded: true,
      selectedId: data.models.find((model) => model.stage === 'Staging')?.id ?? data.models[0]?.id ?? '' })
  },
  select: (selectedId) => set({ selectedId }),
  registerCandidate: (model, authorizedBy) => {
    if (!can(authorizedBy, 'training:authorize') || !get().loaded || get().models.some((item) => item.id === model.id) || model.stage !== 'Staging') return
    set({ models: [...get().models, structuredClone(model)] })
  },
  requestPromotion: (user) => {
    if (!can(user, 'models:request-promotion')) return
    const state = get(), model = state.models.find((item) => item.id === state.selectedId)
    if (!model || model.stage !== 'Staging') return
    const updated: ModelRecord = { ...model, stage: 'Awaiting approval', note: `Approval requested by ${user!.name}` }
    useAuditStore.getState().record({ actor: user!.name, action: 'Model promotion requested', entityId: model.id,
      before: { stage: model.stage, version: model.version }, after: { stage: updated.stage, version: model.version } })
    set({ models: state.models.map((item) => item.id === model.id ? updated : item),
      toast: `Approval requested for ${model.name} ${model.version}. Request logged in audit.` })
  },
  approve: (user) => {
    if (!can(user, 'models:record-approval')) return
    const state = get(), model = state.models.find((item) => item.id === state.selectedId)
    if (!model || model.stage !== 'Awaiting approval') return
    const updated: ModelRecord = { ...model, stage: 'Production', note: `Authority approval recorded by ${user!.name}` }
    useAuditStore.getState().record({ actor: user!.name, action: 'Authority approval recorded', entityId: model.id,
      before: { stage: model.stage, version: model.version }, after: { stage: updated.stage, version: model.version } })
    set({ models: state.models.map((item) => item.id === model.id ? updated : item),
      toast: `${model.name} ${model.version} is now in Production. Approval logged in audit.` })
  },
  requestClass: (name, user) => {
    const state = get()
    if (!can(user, 'models:request-class') || !state.pendingClasses.includes(name) || state.requestedClasses.includes(name)) return
    useAuditStore.getState().record({ actor: user!.name, action: 'Dataset class requested', entityId: name,
      before: null, after: { class: name, status: 'Requested' } })
    set({ requestedClasses: [...state.requestedClasses, name], toast: `Class request for ${name} logged in audit.` })
  },
  dismissToast: () => set({ toast: null }),
}))
