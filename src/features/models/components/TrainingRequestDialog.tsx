import { useState, type FormEvent } from 'react'
import { Dialog } from '../../../components/Dialog'
import { useDatasetsStore } from '../../datasets'
import { useModelsStore } from '../store/useModelsStore'
import { useTrainingStore } from '../store/useTrainingStore'
export function TrainingRequestDialog({ onClose }: { onClose: () => void }) {
  const datasets = useDatasetsStore((state) => state.datasets), models = useModelsStore((state) => state.models)
  const [versionId, setVersionId] = useState(''), [baseId, setBaseId] = useState(''), [error, setError] = useState(''), [discard, setDiscard] = useState(false)
  const options = datasets.flatMap((dataset) => dataset.versions.map((version) => ({ dataset, version })))
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const option = options.find((item) => item.version.id === versionId)
    const message = useTrainingStore.getState().request(option?.dataset.id ?? '', versionId, baseId)
    setError(message)
    if (!message) onClose()
    else event.currentTarget.querySelector<HTMLSelectElement>(!option ? '#training-version' : '#training-base')?.focus()
  }
  const control = 'mt-1 w-full rounded border border-line bg-panel p-2 focus-visible:outline-2 focus-visible:outline-sea'
  return <Dialog title="Request demo training" onClose={() => versionId || baseId ? setDiscard(true) : onClose()}>
    <form className="space-y-4 p-4 text-sm" onSubmit={submit}>
      <p className="text-mute">An administrator must authorize the run. Dataset annotations are copied from the selected version. Simulated training produces a staging candidate with fixed illustrative metrics.</p>
      <label className="block font-semibold" htmlFor="training-version">Dataset version</label>
      <select id="training-version" className={control} value={versionId} aria-invalid={!!error && !versionId} onChange={(event) => setVersionId(event.target.value)}>
        <option value="">Select a version</option>{options.map(({ dataset, version }) => <option key={version.id} value={version.id}>{dataset.name} · {version.name}</option>)}
      </select>
      <label className="block font-semibold" htmlFor="training-base">Base model</label>
      <select id="training-base" className={control} value={baseId} aria-invalid={!!error && !baseId} onChange={(event) => setBaseId(event.target.value)}>
        <option value="">Select a model</option>{models.map((model) => <option key={model.id} value={model.id}>{model.name} {model.version}</option>)}
      </select>
      {!options.length && <p className="text-mute">Create a dataset version before requesting training.</p>}
      {error && <p role="alert" className="text-red">{error}</p>}
      <button className="rounded bg-sea px-4 py-2 font-semibold text-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">Submit request</button>
      {discard && <div className="border border-amber p-3"><p>Discard this training request?</p><div className="mt-2 flex gap-3">
        <button type="button" onClick={() => setDiscard(false)} className="border border-line p-2 focus-visible:outline-2 focus-visible:outline-sea">Keep editing</button>
        <button type="button" onClick={onClose} className="border border-line p-2 focus-visible:outline-2 focus-visible:outline-sea">Discard</button>
      </div></div>}
    </form>
  </Dialog>
}
