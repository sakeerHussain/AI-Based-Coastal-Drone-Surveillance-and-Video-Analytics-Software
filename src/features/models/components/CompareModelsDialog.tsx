import { useState } from 'react'
import { Dialog } from '../../../components/Dialog'
import type { ModelVersion } from '../types'

export function CompareModelsDialog({ versions, defaults, onClose }: {
  versions: ModelVersion[]; defaults: [string, string]; onClose: () => void
}) {
  const [selected, setSelected] = useState(defaults)
  return <Dialog title="Compare versions" onClose={onClose}>
    <p className="px-4 pt-4 text-sm text-mute">F1 scores on the same authorised evaluation set.</p>
    <div className="grid gap-4 p-4 sm:grid-cols-2">
      {selected.map((id, index) => {
        const model = versions.find((item) => item.id === id)!
        return <section key={index} className="min-w-0 rounded border border-line p-4" aria-label={`Comparison ${index + 1}`}>
          <label htmlFor={`compare-${index}`} className="mb-2 block text-sm font-semibold">Model version {index + 1}</label>
          <select id={`compare-${index}`} value={id} onChange={(event) => setSelected(index === 0 ? [event.target.value, selected[1]] : [selected[0], event.target.value])}
            className="w-full rounded border border-line bg-panel px-2 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">
            {versions.filter((item) => item.id !== selected[1 - index]).map((item) => <option key={item.id} value={item.id}>{item.name} {item.version}</option>)}
          </select>
          <p className="mt-4 text-sm">Overall F1 <span className="float-right font-bold">{model.f1.toFixed(2)}</span></p>
          <dl className="mt-3 space-y-3 border-t border-line pt-3 text-sm">
            {Object.entries(model.scores).map(([name, score]) => <div key={name} className="flex justify-between gap-3">
              <dt className="capitalize text-mute">{name}</dt><dd className="font-semibold">{score.toFixed(2)}</dd>
            </div>)}
          </dl>
        </section>
      })}
    </div>
  </Dialog>
}
