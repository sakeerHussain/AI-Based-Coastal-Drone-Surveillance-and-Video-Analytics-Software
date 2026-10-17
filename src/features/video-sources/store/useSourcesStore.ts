import { create } from 'zustand'
import { useAuthStore } from '../../auth'
import { can } from '../../../lib/permissions'
import { useAuditStore } from '../../../lib/useAuditStore'
import { currentTime } from '../../../lib/time'
import { sourceDemoSettings } from '../../../mocks/video-sources/fixtures'
import { sourceSchema, type SourcesData, type SourceInput, type SourceResult, type RecordingMetadata, type RecordingImport } from '../types'

let generation = 0
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
interface SourcesState extends SourcesData {
  loaded: boolean
  testing: Record<string, boolean>
  imports: RecordingImport[]
  hydrate: (data: SourcesData) => void
  saveSource: (input: SourceInput, id?: string) => SourceResult
  testSource: (id: string) => Promise<SourceResult>
  importRecording: (input: RecordingMetadata) => SourceResult
  reset: () => void
}
export const useSourcesStore = create<SourcesState>((set, get) => ({
  sources: [], drones: [], imports: [], testing: {}, loaded: false,
  reset: () => { generation += 1; set({ sources: [], drones: [], imports: [], testing: {}, loaded: false }) },
  hydrate: (data) => { if (!get().loaded) set({ ...structuredClone(data), loaded: true }) },
  saveSource: (input, id) => {
    const actor = useAuthStore.getState().user
    if (!can(actor, 'sources:manage')) return { ok: false, message: 'Only supervisors and administrators can configure sources.' }
    const parsed = sourceSchema.safeParse(input)
    if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message }
    const data = parsed.data
    if (!get().loaded || !get().drones.some((drone) => drone.id === data.droneId)) return { ok: false, message: 'Select a drone from the directory.' }
    const previous = get().sources.find((source) => source.id === id)
    if (id && !previous) return { ok: false, message: 'This source no longer exists.' }
    if (get().sources.some((source) => source.id !== id && source.endpoint === data.endpoint)) return { ok: false, message: 'This stream address is already configured.' }
    if (previous && Object.keys(data).every((key) => previous[key as keyof SourceInput] === data[key as keyof SourceInput])) return { ok: true, message: 'No source changes to save.' }
    const source = { ...data, id: id ?? crypto.randomUUID(), status: data.enabled ? 'Not tested' as const : 'Disabled' as const,
      lastTested: null, feedIndex: previous?.droneId === data.droneId ? previous.feedIndex : null }
    useAuditStore.getState().record({ actor: actor!.name, action: previous ? 'Video source updated' : 'Video source created', entityId: source.id,
      before: previous ? { name: previous.name, droneId: previous.droneId, endpoint: previous.endpoint, protocol: previous.protocol, enabled: String(previous.enabled) } : null,
      after: { ...data, enabled: String(data.enabled) } })
    set((state) => ({ sources: previous ? state.sources.map((item) => item.id === id ? source : item) : [...state.sources, source], testing: { ...state.testing, [source.id]: false } }))
    return { ok: true, message: 'Source configuration saved for this session. Change logged in audit.' }
  },
  testSource: async (id) => {
    const actor = useAuthStore.getState().user
    if (!can(actor, 'sources:manage')) return { ok: false, message: 'Only supervisors and administrators can run source tests.' }
    const source = get().sources.find((item) => item.id === id)
    if (!source?.enabled) return { ok: false, message: 'Enable the source before testing.' }
    if (get().testing[id]) return { ok: false, message: 'A test is already running.' }
    const version = generation
    set((state) => ({ testing: { ...state.testing, [id]: true } }))
    await delay(sourceDemoSettings.testDelayMs)
    if (generation !== version || get().sources.find((item) => item.id === id) !== source) return { ok: false, message: 'Test cancelled because the source or demo changed.' }
    useAuditStore.getState().record({ actor: actor!.name, action: 'Source test simulated', entityId: id,
      before: { status: source.status }, after: { status: 'Connected', mode: 'Demo simulation' } })
    set((state) => ({ sources: state.sources.map((item) => item.id === id ? { ...item, status: 'Connected', lastTested: currentTime() } : item), testing: { ...state.testing, [id]: false } }))
    return { ok: true, message: 'Demo connection test complete. No network connection was made.' }
  },
  importRecording: (input) => {
    const actor = useAuthStore.getState().user
    if (!can(actor, 'sources:manage')) return { ok: false, message: 'Only supervisors and administrators can simulate imports.' }
    if (!get().loaded || !get().drones.some((drone) => drone.id === input.droneId)) return { ok: false, message: 'Select a drone from the directory.' }
    const extension = input.name.split('.').pop()?.toLowerCase() ?? ''
    if (!sourceDemoSettings.extensions.includes(extension) || !Number.isFinite(input.size) || input.size <= 0 || input.size > sourceDemoSettings.maxImportBytes) {
      return { ok: false, message: 'Choose a non-empty MP4, MOV, AVI or MKV file up to 2 GB.' }
    }
    const job: RecordingImport = { ...input, name: input.name.trim(), id: crypto.randomUUID(), createdAt: currentTime(), progress: 0, status: 'Processing' }
    const version = generation
    useAuditStore.getState().record({ actor: actor!.name, action: 'Recording import simulated', entityId: job.id, before: null,
      after: { file: job.name, size: job.size, droneId: job.droneId, mode: 'Metadata only' } })
    set((state) => ({ imports: [job, ...state.imports] }))
    void (async () => {
      for (let progress = sourceDemoSettings.importStepPercent; progress <= 100; progress += sourceDemoSettings.importStepPercent) {
        await delay(sourceDemoSettings.importStepMs)
        if (generation !== version) return
        set((state) => ({ imports: state.imports.map((item) => item.id === job.id ? { ...item, progress, status: progress === 100 ? 'Complete' : 'Processing' } : item) }))
      }
      useAuditStore.getState().record({ actor: actor!.name, action: 'Demo import completed', entityId: job.id, before: { status: 'Processing' }, after: { status: 'Complete', file: job.name, droneId: job.droneId, mode: 'Metadata only' } })
    })()
    return { ok: true, message: 'Demo import queued. File contents stay on your device.' }
  },
}))
