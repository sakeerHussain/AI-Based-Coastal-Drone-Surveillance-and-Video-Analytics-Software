import { useState } from 'react'
import { Dialog } from '../../../components/Dialog'
import type { AnnotationBox, DatasetFrame } from '../types'
import { useDatasetsStore } from '../store/useDatasetsStore'
import { AnnotationCanvas } from './AnnotationCanvas'
import { AnnotationInspector } from './AnnotationInspector'
export function AnnotationWorkspace({ datasetId, frame, onClose }: { datasetId: string; frame: DatasetFrame; onClose: () => void }) {
  const [boxes, setBoxes] = useState(() => structuredClone(frame.boxes)), [selectedId, setSelectedId] = useState(frame.boxes[0]?.id ?? '')
  const [error, setError] = useState(''), [discard, setDiscard] = useState(false)
  const classes = useDatasetsStore((state) => state.classes)
  const dirty = JSON.stringify(frame.boxes) !== JSON.stringify(boxes)
  function add(bounds = { x: 10, y: 10, width: 20, height: 20 }) {
    const box: AnnotationBox = { id: crypto.randomUUID(), label: classes[0], ...bounds }
    setBoxes([...boxes, box]); setSelectedId(box.id)
  }
  return <Dialog title={`Annotate · ${frame.name}`} onClose={() => dirty ? setDiscard(true) : onClose()}>
    <div className="space-y-3 p-4">
      <AnnotationCanvas frame={frame} boxes={boxes} selectedId={selectedId} onSelect={setSelectedId} onAdd={add} />
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs"><span>{boxes.length} annotations · {dirty ? 'Unsaved changes' : frame.reviewed ? 'Reviewed' : 'Awaiting review'}</span>
        <button type="button" onClick={() => add()} className="rounded border border-line px-3 py-2 focus-visible:outline-2 focus-visible:outline-sea">Add box</button></div>
      <label className="block text-xs">Annotation<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}
        className="ml-2 max-w-full rounded border border-line bg-panel p-2 focus-visible:outline-2 focus-visible:outline-sea"><option value="">Select annotation</option>
        {boxes.map((box, index) => <option key={box.id} value={box.id}>{index + 1}. {box.label}</option>)}</select></label>
      <AnnotationInspector box={boxes.find((box) => box.id === selectedId)} classes={classes}
        onChange={(updated) => setBoxes(boxes.map((box) => box.id === updated.id ? updated : box))}
        onDelete={() => { setBoxes(boxes.filter((box) => box.id !== selectedId)); setSelectedId('') }} />
      {error && <p role="alert" className="text-sm text-red">{error}</p>}
      <button type="button" onClick={() => { const message = useDatasetsStore.getState().saveAnnotations(datasetId, frame.id, boxes); setError(message); if (!message) onClose() }}
        className="rounded bg-sea px-4 py-2 text-sm font-semibold text-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">Save and mark reviewed</button>
      {discard && <div className="rounded border border-amber p-3 text-sm"><p>Discard unsaved annotations?</p><div className="mt-2 flex gap-3">
        <button type="button" onClick={() => setDiscard(false)} className="border border-line px-3 py-2 focus-visible:outline-2 focus-visible:outline-sea">Keep editing</button>
        <button type="button" onClick={onClose} className="border border-line px-3 py-2 focus-visible:outline-2 focus-visible:outline-sea">Discard</button>
      </div></div>}
    </div>
  </Dialog>
}
