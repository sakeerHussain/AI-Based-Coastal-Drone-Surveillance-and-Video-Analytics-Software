import { useEffect, useId, useRef, useState } from 'react'
import { incidentEvidence } from '../../../mocks/incidents/evidence'
import { createEvidenceManifest, downloadEvidenceManifest } from '../manifest'
import type { Incident } from '../types'

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'
export function EvidenceDialog({ incident, onClose }: { incident: Incident; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const headingId = useId()
  const [error, setError] = useState(false)
  const evidence = incidentEvidence[incident.id]
  useEffect(() => {
    const element = dialog.current!
    const previous = document.activeElement
    element.showModal()
    return () => {
      element.close()
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true })
    }
  }, [])
  function download() {
    try {
      downloadEvidenceManifest(incident, evidence)
      setError(false)
    } catch {
      setError(true)
    }
  }
  return (
    <dialog ref={dialog} aria-labelledby={headingId} onCancel={(event) => { event.preventDefault(); onClose() }}
      className="fixed inset-0 m-auto max-h-[80dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-auto rounded border border-line bg-panel p-5 text-ink backdrop:bg-ink/40">
      <h2 id={headingId} className="text-lg font-bold">Evidence pack</h2>
      <p className="mt-1 text-sm text-mute">{incident.title}</p>
      <h3 className="mt-4 text-sm font-semibold">Files</h3>
      <ul tabIndex={0} aria-label="Evidence files"
        className={`mt-1 max-h-40 list-inside list-disc overflow-auto break-words text-sm ${focus}`}>
        {evidence.files.map((file) => <li key={file.name} className="py-0.5">{file.name}</li>)}
      </ul>
      <h3 className="mt-4 text-sm font-semibold">Hash manifest</h3>
      <pre tabIndex={0} aria-label="Hash manifest contents"
        className={`mt-2 max-h-36 overflow-auto whitespace-pre-wrap break-all rounded bg-paper p-3 font-sans text-xs ${focus}`}>
        {createEvidenceManifest(incident, evidence)}
      </pre>
      {error && <p role="alert" className="mt-2 text-sm text-red">The manifest could not be downloaded. Try again.</p>}
      <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
        <button type="button" onClick={download} className={`rounded bg-sea px-4 py-2 text-panel ${focus}`}>
          Download manifest
        </button>
        <button type="button" onClick={onClose} className={`rounded border border-line px-4 py-2 ${focus}`}>Close</button>
      </div>
    </dialog>
  )
}
