import { create } from 'zustand'
import { useAuthStore } from '../../auth'
import { useDatasetsStore } from '../../datasets'
import { can } from '../../../lib/permissions'
import { useAuditStore } from '../../../lib/useAuditStore'
import { useModelsStore } from './useModelsStore'
import type { TrainingConfig, TrainingJob } from '../trainingTypes'
let generation = 0
interface TrainingState {
  jobs: TrainingJob[]; config: TrainingConfig | null
  reset: () => void; hydrate: (config: TrainingConfig) => void
  request: (datasetId: string, versionId: string, baseId: string) => string
  authorize: (id: string) => Promise<string>
}
export const useTrainingStore = create<TrainingState>((set, get) => ({
  jobs: [], config: null,
  reset: () => { generation++; set(useTrainingStore.getInitialState(), true) },
  hydrate: (config) => { if (!get().config) set({ config: structuredClone(config) }) },
  request: (datasetId, versionId, baseId) => {
    const user = useAuthStore.getState().user, config = get().config
    if (!can(user, 'training:request')) return 'You do not have permission to request training.'
    const dataset = useDatasetsStore.getState().datasets.find((item) => item.id === datasetId)
    const snapshot = dataset?.versions.find((item) => item.id === versionId)
    const base = useModelsStore.getState().models.find((item) => item.id === baseId)
    if (!dataset || !snapshot || !base || !config) return 'Select an available dataset version and base model.'
    if (get().jobs.some((job) => job.snapshot.id === versionId && job.base.id === baseId && job.status !== 'Completed')) return 'An active request already exists for this dataset version and base model.'
    const job: TrainingJob = { id: crypto.randomUUID(), datasetName: dataset.name, snapshot: structuredClone(snapshot),
      base: structuredClone(base), config: structuredClone(config), requestedBy: user!.name, requestedAt: new Date().toISOString(), status: 'Awaiting authorization', progress: 0 }
    set({ jobs: [...get().jobs, job] })
    useAuditStore.getState().record({ actor: user!.name, action: 'Training requested', entityId: job.id, before: null,
      after: { dataset: dataset.name, version: snapshot.name, base: `${base.name} ${base.version}`, status: job.status } })
    return ''
  },
  authorize: async (id) => {
    const user = useAuthStore.getState().user, job = get().jobs.find((item) => item.id === id)
    if (!can(user, 'training:authorize')) return 'Administrator authorization is required.'
    if (!job || job.status !== 'Awaiting authorization') return 'This request is no longer awaiting authorization.'
    const run = generation
    const update = (patch: Partial<TrainingJob>) => set({ jobs: get().jobs.map((item) => item.id === id ? { ...item, ...patch } : item) })
    update({ status: 'Training', authorizedBy: user!.name })
    useAuditStore.getState().record({ actor: user!.name, action: 'Training authorized', entityId: id,
      before: { status: job.status }, after: { status: 'Training', datasetVersion: job.snapshot.id } })
    for (let epoch = 1; epoch <= job.config.epochs; epoch++) {
      await new Promise((resolve) => setTimeout(resolve, job.config.stepMs))
      if (generation !== run) return ''
      update({ progress: Math.round(epoch / job.config.epochs * 100) })
    }
    const candidateId = `trained-${id}`
    const scores = Object.fromEntries(job.config.metrics.map((metric) => [metric.label, metric.f1]))
    // The authorized run may finish after sign-out. Authorization is captured at run start.
    useModelsStore.getState().registerCandidate({ id: candidateId, name: job.base.name,
      version: `${job.base.version}-demo-${id.slice(0, 8)}`, f1: job.config.metrics.reduce((sum, metric) => sum + metric.f1, 0) / job.config.metrics.length,
      scores, stage: 'Staging', note: `Simulated training · ${job.datasetName} ${job.snapshot.name} · Fixed demo evaluation` }, user)
    update({ status: 'Completed', candidateId })
    useAuditStore.getState().record({ actor: user!.name, action: 'Demo training completed', entityId: id,
      before: { status: 'Training' }, after: { status: 'Completed', candidate: candidateId, stage: 'Staging' } })
    return ''
  },
}))
