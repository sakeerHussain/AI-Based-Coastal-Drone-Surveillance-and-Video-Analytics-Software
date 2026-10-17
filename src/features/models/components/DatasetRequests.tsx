import { can } from '../../../lib/permissions'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../auth'
import { useModelsStore } from '../store/useModelsStore'
import type { Dataset } from '../types'

export function DatasetRequests({ dataset }: { dataset: Dataset }) {
  const user = useAuthStore((state) => state.user)
  const requested = useModelsStore((state) => state.requestedClasses)
  const request = useModelsStore((state) => state.requestClass)
  return <section className="mt-6 text-sm" aria-labelledby="dataset-title">
    <h3 id="dataset-title" className="font-semibold">Dataset</h3>
    <Link to="/datasets" className="mt-2 inline-block text-sea underline focus-visible:outline-2 focus-visible:outline-sea">Open datasets and annotation</Link>
    <p className="mt-1 text-mute">{dataset.annotatedFrames.toLocaleString('en-GB')} annotated frames from authorised patrols. {dataset.pendingClasses.length} new classes pending.</p>
    <ul className="mt-2 divide-y divide-line">
      {dataset.pendingClasses.map((name) => <li key={name} className="flex items-center justify-between gap-3 py-2">
        <span>{name}</span>
        {can(user, 'models:request-class') && <button type="button" disabled={requested.includes(name)} onClick={() => request(name, user)}
          aria-label={`${requested.includes(name) ? 'Requested' : 'Request class'}: ${name}`}
          className="rounded border border-line bg-panel px-3 py-1.5 font-semibold text-sea focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea disabled:opacity-50">
          {requested.includes(name) ? 'Requested' : 'Request class'}
        </button>}
      </li>)}
    </ul>
  </section>
}
