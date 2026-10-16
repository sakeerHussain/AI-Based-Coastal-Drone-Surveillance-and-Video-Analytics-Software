import type { ModelRecord, ModelStage } from '../types'

const tones: Record<ModelStage, string> = { Production: 'border-green', Staging: 'border-amber', 'Awaiting approval': 'border-red' }
export function ModelRegistry({ models, selectedId, onSelect }: {
  models: ModelRecord[]; selectedId: string; onSelect: (id: string) => void
}) {
  return <div className="mt-3 overflow-x-auto">
    <table className="w-full text-sm">
      <caption className="sr-only">Model registry. Select a model for promotion or approval.</caption>
      <thead className="border-b border-line text-left text-mute"><tr>
        <th scope="col" className="py-2 pr-4">Model</th><th scope="col" className="pr-4">Version</th>
        <th scope="col" className="pr-4">Score (F1)</th><th scope="col">Stage</th>
      </tr></thead>
      <tbody className="divide-y divide-line">
        {models.map((model) => <tr key={model.id} className={selectedId === model.id ? 'bg-shoal/30' : ''}>
          <td className="py-3 pr-4">
            <label className="flex items-start gap-2">
              <input type="radio" name="selected-model" aria-label={`Select ${model.name}`} checked={selectedId === model.id}
                onChange={() => onSelect(model.id)}
                className="mt-1 shrink-0 accent-sea focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea" />
              <span><span className="block font-semibold">{model.name}</span><span className="block text-xs text-ink">{model.note}</span></span>
            </label>
          </td>
          <td className="pr-4">{model.version}</td><td className="pr-4">{model.f1.toFixed(2)}</td>
          <td><span className={`inline-block rounded border-l-4 bg-paper px-2 py-0.5 text-xs font-semibold text-ink ${tones[model.stage]}`}>{model.stage}</span></td>
        </tr>)}
      </tbody>
    </table>
  </div>
}
