import { useRef, useState } from 'react'
import { Dialog } from '../../../components/Dialog'
import { FormErrorSummary } from '../../../components/FormErrorSummary'
import { focusFirstInvalid } from '../../../lib/focusFirstInvalid'
import { sourceSchema, type SourceInput, type SourceDrone, type VideoSource } from '../types'
import { useSourcesStore } from '../store/useSourcesStore'

const field = 'mt-1 w-full rounded border border-line bg-panel px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-sea'

export function SourceEditorDialog({ source, drones, onClose, onSaved }: {
  source?: VideoSource; drones: SourceDrone[]; onClose: () => void; onSaved: (message: string) => void
}) {
  const original: SourceInput = source ? { name: source.name, droneId: source.droneId, protocol: source.protocol, endpoint: source.endpoint, enabled: source.enabled }
    : { name: '', droneId: drones[0]?.id ?? '', protocol: 'RTSP', endpoint: '', enabled: true }
  const [draft, setDraft] = useState(original)
  const [errors, setErrors] = useState<Partial<Record<keyof SourceInput, string>>>({})
  const [attempt, setAttempt] = useState(0)
  const [failure, setFailure] = useState('')
  const [discard, setDiscard] = useState(false)
  const form = useRef<HTMLFormElement>(null)
  const save = useSourcesStore((state) => state.saveSource)
  const dirty = Object.keys(original).some((key) => original[key as keyof SourceInput] !== draft[key as keyof SourceInput])
  function close() { if (dirty) setDiscard(true); else onClose() }
  function edit(key: keyof SourceInput, value: string | boolean) { setDraft((previous) => ({ ...previous, [key]: value })); setFailure(''); setDiscard(false) }
  return <Dialog title={source ? 'Edit video source' : 'Add video source'} onClose={close}>
    <form ref={form} noValidate className="p-4" onSubmit={(event) => {
      event.preventDefault(); setAttempt((value) => value + 1); setFailure('')
      const result = sourceSchema.safeParse(draft)
      if (!result.success) {
        setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])))
        focusFirstInvalid(form.current); return
      }
      setErrors({})
      const saved = save(result.data, source?.id)
      if (!saved.ok) { setFailure(saved.message); return }
      onSaved(saved.message); onClose()
    }}>
      <p className="text-sm text-mute">Demo configuration only. Changes do not connect to a real stream or alter the live feed wall.</p>
      <FormErrorSummary count={Object.keys(errors).length} attempt={attempt} />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="source-name" className="text-sm">Source name</label>
          <input id="source-name" value={draft.name} onChange={(event) => edit('name', event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'source-name-error' : undefined} className={field} />
          {errors.name && <p id="source-name-error" className="mt-1 text-xs text-red">{errors.name}</p>}</div>
        <div><label htmlFor="source-drone" className="text-sm">Drone</label>
          <select id="source-drone" value={draft.droneId} onChange={(event) => edit('droneId', event.target.value)} aria-invalid={!!errors.droneId} className={field}>
            {drones.map((drone) => <option key={drone.id} value={drone.id}>{drone.id} · {drone.location}</option>)}
          </select></div>
        <div><label htmlFor="source-protocol" className="text-sm">Protocol</label>
          <select id="source-protocol" value={draft.protocol} onChange={(event) => edit('protocol', event.target.value)} className={field}>
            <option>RTSP</option><option>RTMP</option><option>SRT</option>
          </select></div>
        <label className="flex items-center gap-2 self-end py-2 text-sm"><input type="checkbox" checked={draft.enabled} onChange={(event) => edit('enabled', event.target.checked)} className="accent-sea focus-visible:outline-2 focus-visible:outline-sea" />Source enabled</label>
        <div className="sm:col-span-2"><label htmlFor="source-endpoint" className="text-sm">Stream address</label>
          <input id="source-endpoint" value={draft.endpoint} onChange={(event) => edit('endpoint', event.target.value)} placeholder="rtsp://drone.demo.invalid/live" aria-invalid={!!errors.endpoint} aria-describedby={errors.endpoint ? 'source-endpoint-error' : 'source-endpoint-help'} className={field} />
          <p id="source-endpoint-help" className="mt-1 text-xs text-mute">Use a demo address matching the selected protocol, without embedded credentials.</p>
          {errors.endpoint && <p id="source-endpoint-error" className="mt-1 text-xs text-red">{errors.endpoint}</p>}</div>
      </div>
      {failure && <p role="alert" className="mt-4 border-l-4 border-red bg-paper p-3 text-sm">{failure}</p>}
      {discard && <div role="alert" className="mt-4 border-l-4 border-amber bg-paper p-3 text-sm">
        <p>Discard your unsaved source changes?</p><div className="mt-2 flex gap-3">
          <button type="button" onClick={() => setDiscard(false)} className="underline focus-visible:outline-2 focus-visible:outline-sea">Keep editing</button>
          <button type="button" onClick={onClose} className="underline focus-visible:outline-2 focus-visible:outline-sea">Discard changes</button>
        </div></div>}
      <div className="mt-5 flex justify-end gap-2 text-sm">
        <button type="button" onClick={close} className="rounded border border-line px-4 py-2 focus-visible:outline-2 focus-visible:outline-sea">Cancel</button>
        <button type="submit" className="rounded bg-sea px-4 py-2 font-semibold text-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">Save source</button>
      </div>
    </form>
  </Dialog>
}
