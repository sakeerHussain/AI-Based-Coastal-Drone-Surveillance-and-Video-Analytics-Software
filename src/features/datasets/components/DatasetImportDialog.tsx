import { useState, type FormEvent } from 'react'
import { Dialog } from '../../../components/Dialog'
import { useDatasetsStore } from '../store/useDatasetsStore'
export function DatasetImportDialog({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null), [error, setError] = useState(''), [discard, setDiscard] = useState(false)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = file ? useDatasetsStore.getState().importFrame(file.name, file.size, file.type) : 'Select a JPEG or PNG frame.'
    setError(message)
    if (!message) onClose()
    else event.currentTarget.querySelector('input')?.focus()
  }
  return <Dialog title="Simulate frame import" onClose={() => file ? setDiscard(true) : onClose()}>
    <form onSubmit={submit} className="space-y-4 p-4 text-sm">
      <p className="text-mute">Choose a JPEG or PNG up to 20 MB. Only its metadata is used; the file is not uploaded or displayed. The workspace uses a schematic demo frame.</p>
      <label className="block font-semibold">Image frame<input type="file" accept="image/jpeg,image/png" aria-invalid={!!error} aria-describedby={error ? 'import-error' : undefined}
        onChange={(event) => { setFile(event.target.files?.[0] ?? null); setError('') }}
        className="mt-2 block w-full rounded border border-line p-2 focus-visible:outline-2 focus-visible:outline-sea" /></label>
      {error && <p id="import-error" role="alert" className="text-red">{error}</p>}
      <button className="rounded bg-sea px-4 py-2 font-semibold text-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">Create demo dataset</button>
      {discard && <div className="rounded border border-amber p-3"><p>Discard this import?</p><div className="mt-2 flex gap-3">
        <button type="button" onClick={() => setDiscard(false)} className="border border-line px-3 py-2 focus-visible:outline-2 focus-visible:outline-sea">Keep editing</button>
        <button type="button" onClick={onClose} className="border border-line px-3 py-2 focus-visible:outline-2 focus-visible:outline-sea">Discard</button>
      </div></div>}
    </form>
  </Dialog>
}
