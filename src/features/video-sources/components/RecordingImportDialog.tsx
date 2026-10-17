import { useRef, useState } from 'react'
import { Dialog } from '../../../components/Dialog'
import { focusFirstInvalid } from '../../../lib/focusFirstInvalid'
import { sourceDemoSettings } from '../../../mocks/video-sources/fixtures'
import { useSourcesStore } from '../store/useSourcesStore'
import type { SourceDrone } from '../types'

const field = 'mt-1 w-full rounded border border-line bg-panel px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-sea'

export function RecordingImportDialog({ drones, onClose, onQueued }: {
  drones: SourceDrone[]; onClose: () => void; onQueued: (message: string) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [droneId, setDroneId] = useState(drones[0]?.id ?? '')
  const [error, setError] = useState('')
  const [discard, setDiscard] = useState(false)
  const form = useRef<HTMLFormElement>(null)
  const importRecording = useSourcesStore((state) => state.importRecording)
  function close() { if (file) setDiscard(true); else onClose() }
  return <Dialog title="Simulate recording import" onClose={close}>
    <form ref={form} noValidate className="p-4" onSubmit={(event) => {
      event.preventDefault()
      if (!file) { setError('Choose a recording file.'); focusFirstInvalid(form.current); return }
      const result = importRecording({ name: file.name, size: file.size, droneId })
      if (!result.ok) { setError(result.message); focusFirstInvalid(form.current); return }
      onQueued(result.message); onClose()
    }}>
      <p className="text-sm text-mute">Only the filename, size and drone association are recorded. File contents are not uploaded, analysed or added to Archive.</p>
      <div className="mt-4"><label htmlFor="recording-drone" className="text-sm">Drone</label>
        <select id="recording-drone" value={droneId} onChange={(event) => setDroneId(event.target.value)} className={field}>
          {drones.map((drone) => <option key={drone.id} value={drone.id}>{drone.id} · {drone.location}</option>)}
        </select></div>
      <div className="mt-4"><label htmlFor="recording-file" className="text-sm">Recording file</label>
        <input id="recording-file" type="file" accept={sourceDemoSettings.extensions.map((extension) => `.${extension}`).join(',')}
          onChange={(event) => { setFile(event.target.files?.[0] ?? null); setError(''); setDiscard(false) }} aria-invalid={!!error} aria-describedby="recording-help recording-error" className={field} />
        <p id="recording-help" className="mt-1 text-xs text-mute">MP4, MOV, AVI or MKV · Up to 2 GB · Simulated processing</p>
        <p id="recording-error" role={error ? 'alert' : undefined} className="mt-2 text-sm text-red">{error}</p>
      </div>
      {discard && <div role="alert" className="mt-4 border-l-4 border-amber bg-paper p-3 text-sm">
        <p>Discard this import selection?</p><div className="mt-2 flex gap-3">
          <button type="button" onClick={() => setDiscard(false)} className="underline focus-visible:outline-2 focus-visible:outline-sea">Keep editing</button>
          <button type="button" onClick={onClose} className="underline focus-visible:outline-2 focus-visible:outline-sea">Discard selection</button>
        </div></div>}
      <div className="mt-5 flex justify-end gap-2 text-sm">
        <button type="button" onClick={close} className="rounded border border-line px-4 py-2 focus-visible:outline-2 focus-visible:outline-sea">Cancel</button>
        <button type="submit" className="rounded bg-sea px-4 py-2 font-semibold text-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">Simulate import</button>
      </div>
    </form>
  </Dialog>
}
