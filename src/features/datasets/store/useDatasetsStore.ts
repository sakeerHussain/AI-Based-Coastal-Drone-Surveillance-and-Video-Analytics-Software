import { create } from 'zustand'
import { useAuthStore } from '../../auth'
import { can } from '../../../lib/permissions'
import { useAuditStore } from '../../../lib/useAuditStore'
import type { AnnotationBox, DatasetRecord, DatasetsData } from '../types'

interface DatasetsState {
  loaded: boolean; datasets: DatasetRecord[]; classes: string[]; maxImportBytes: number
  reset: () => void; hydrate: (data: DatasetsData) => void
  importFrame: (name: string, size: number, type: string) => string
  saveAnnotations: (datasetId: string, frameId: string, boxes: AnnotationBox[]) => string
  createVersion: (datasetId: string) => string
}
export const useDatasetsStore = create<DatasetsState>((set, get) => ({
  loaded: false, datasets: [], classes: [], maxImportBytes: 0,
  reset: () => set(useDatasetsStore.getInitialState(), true),
  hydrate: (data) => { if (!get().loaded) set({ ...structuredClone(data), loaded: true }) },
  importFrame: (rawName, size, type) => {
    const user = useAuthStore.getState().user, name = rawName.trim()
    if (!can(user, 'datasets:manage')) return 'You do not have permission to import frames.'
    if (!get().loaded || !name || name.length > 160 || !['image/jpeg', 'image/png'].includes(type) || size <= 0 || size > get().maxImportBytes)
      return 'Select a JPEG or PNG frame up to 20 MB.'
    const id = crypto.randomUUID()
    const dataset: DatasetRecord = { id, name, source: 'Simulated frame import', frameCount: 1, versions: [],
      frames: [{ id: crypto.randomUUID(), name, shore: true, boxes: [], reviewed: false }] }
    set({ datasets: [...get().datasets, dataset] })
    useAuditStore.getState().record({ actor: user!.name, action: 'Dataset import simulated', entityId: id, before: null, after: { name, bytes: size } })
    return ''
  },
  saveAnnotations: (datasetId, frameId, boxes) => {
    const user = useAuthStore.getState().user, state = get()
    if (!can(user, 'datasets:annotate')) return 'You do not have permission to annotate frames.'
    const dataset = state.datasets.find((item) => item.id === datasetId), frame = dataset?.frames.find((item) => item.id === frameId)
    if (!frame) return 'Frame not found.'
    if (boxes.some((box) => !state.classes.includes(box.label) || ![box.x, box.y, box.width, box.height].every(Number.isFinite)
      || box.x < 0 || box.y < 0 || box.width < 1 || box.height < 1 || box.x + box.width > 100 || box.y + box.height > 100)
      || new Set(boxes.map((box) => box.id)).size !== boxes.length) return 'Check the class and bounds of each annotation.'
    if (frame.reviewed && JSON.stringify(frame.boxes) === JSON.stringify(boxes)) return ''
    set({ datasets: state.datasets.map((item) => item.id === datasetId ? { ...item, frames: item.frames.map((entry) => entry.id === frameId
      ? { ...entry, boxes: structuredClone(boxes), reviewed: true } : entry) } : item) })
    useAuditStore.getState().record({ actor: user!.name, action: 'Frame annotations saved', entityId: frameId,
      before: { boxes: JSON.stringify(frame.boxes), reviewed: String(frame.reviewed) }, after: { boxes: JSON.stringify(boxes), reviewed: 'true' } })
    return ''
  },
  createVersion: (datasetId) => {
    const user = useAuthStore.getState().user, dataset = get().datasets.find((item) => item.id === datasetId)
    if (!can(user, 'datasets:manage')) return 'You do not have permission to create versions.'
    if (!dataset || !dataset.frames.every((frame) => frame.reviewed)) return 'Review and save every sample frame before creating a version.'
    if (dataset.versions.some((version) => JSON.stringify(version.frames) === JSON.stringify(dataset.frames))) return 'These annotations already have a version.'
    const version = { id: crypto.randomUUID(), name: `v${dataset.versions.length + 1}`, createdAt: new Date().toISOString(), frames: structuredClone(dataset.frames) }
    set({ datasets: get().datasets.map((item) => item.id === datasetId ? { ...item, versions: [...item.versions, version] } : item) })
    useAuditStore.getState().record({ actor: user!.name, action: 'Dataset version created', entityId: datasetId,
      before: { versions: dataset.versions.length }, after: { version: version.name, sampleFrames: version.frames.length } })
    return ''
  },
}))
