import type { DatasetsData, DatasetFrame, DatasetRecord } from '../../features/datasets'
import { modelDataset } from '../models/dataset'

const frames: DatasetFrame[] = [
  { id: 'frame-01', name: 'Munambam approach · 09:12:04', shore: true, reviewed: true,
    boxes: [{ id: 'box-1', label: 'vessel', x: 38, y: 42, width: 18, height: 14 }] },
  { id: 'frame-02', name: 'Harbour perimeter · 09:12:08', shore: true, reviewed: false,
    boxes: [{ id: 'box-2', label: 'person', x: 67, y: 68, width: 7, height: 15 }] },
  { id: 'frame-03', name: 'Offshore channel · 09:12:12', shore: false, reviewed: false,
    boxes: [{ id: 'box-3', label: 'vessel', x: 28, y: 34, width: 20, height: 12 }] },
]
const dataset: DatasetRecord = { id: 'coastal-baseline', name: 'Coastal baseline', source: 'Existing annotated corpus',
  frameCount: modelDataset.annotatedFrames, frames, versions: [{ id: 'coastal-baseline-v1', name: 'v1', createdAt: '2026-10-02T10:00:00+05:30', frames: frames.map((frame) => ({ ...structuredClone(frame), reviewed: true })) }] }
export const datasetsFixture: DatasetsData = {
  datasets: [dataset], classes: ['person', 'vehicle', 'vessel', 'dhow', 'jet ski', 'fishing net'], maxImportBytes: 20 * 1024 * 1024,
}
