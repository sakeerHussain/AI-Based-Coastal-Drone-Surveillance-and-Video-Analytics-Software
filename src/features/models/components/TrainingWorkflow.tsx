import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../auth'
import { useDatasets, useDatasetsStore } from '../../datasets'
import { can } from '../../../lib/permissions'
import { useTrainingStore } from '../store/useTrainingStore'
import { TrainingRequestDialog } from './TrainingRequestDialog'
import { EvaluationResults } from './EvaluationResults'
import type { TrainingConfig } from '../trainingTypes'
export function TrainingWorkflow({ config }: { config: TrainingConfig }) {
  const query = useDatasets(), hydrateDatasets = useDatasetsStore((state) => state.hydrate)
  const jobs = useTrainingStore((state) => state.jobs), hydrate = useTrainingStore((state) => state.hydrate)
  const user = useAuthStore((state) => state.user)
  const [requesting, setRequesting] = useState(false), [selectedId, setSelectedId] = useState(''), [error, setError] = useState('')
  useEffect(() => { hydrate(config); if (query.data) hydrateDatasets(query.data) }, [config, query.data, hydrate, hydrateDatasets])
  const selected = jobs.find((job) => job.id === selectedId) ?? jobs.filter((job) => job.status === 'Completed').at(-1)
  return <>
    <section className="rounded border border-line bg-panel p-4" aria-label="Training workflow">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Training and evaluation</h2>
        <p className="mt-1 text-xs text-mute">Request → Administrator authorization → Demo training → Staging candidate</p></div>
        {can(user, 'training:request') && <button disabled={!query.data} onClick={() => setRequesting(true)}
          className="rounded bg-sea px-4 py-2 text-sm font-semibold text-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea disabled:opacity-50">Request demo training</button>}</div>
      {query.isPending && <p role="status" className="mt-3 text-sm text-mute">Loading dataset versions…</p>}
      {query.isError && <div role="alert" className="mt-3 text-sm"><p>Could not load dataset versions.</p><button onClick={() => void query.refetch()} className="mt-2 border border-line p-2 focus-visible:outline-2 focus-visible:outline-sea">Retry datasets</button></div>}
      <Link to="/datasets" className="mt-3 inline-block text-xs text-sea underline focus-visible:outline-2 focus-visible:outline-sea">Manage datasets and annotations</Link>
      {!jobs.length && <p className="mt-3 text-sm text-mute">No training requests yet. Existing registered models are unchanged.</p>}
      <ul className="mt-3 divide-y divide-line">{jobs.map((job) => <li key={job.id} className="py-3 text-sm">
        <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><p className="break-words font-semibold">{job.base.name} · {job.datasetName} {job.snapshot.name}</p>
          <p className="mt-1 text-xs text-mute">Requested by {job.requestedBy} · {new Date(job.requestedAt).toLocaleString('en-GB')}</p>
          <p className="mt-1 text-xs">{job.status}{job.authorizedBy ? ` · Authorized by ${job.authorizedBy}` : ''}</p></div>
          {job.status === 'Awaiting authorization' && can(user, 'training:authorize') && <button onClick={() => void useTrainingStore.getState().authorize(job.id).then(setError)}
            className="rounded border border-line px-3 py-2 text-sea focus-visible:outline-2 focus-visible:outline-sea">Authorize and run</button>}
          {job.status === 'Completed' && <button onClick={() => setSelectedId(job.id)} aria-pressed={selected?.id === job.id}
            className="rounded border border-line px-3 py-2 text-sea focus-visible:outline-2 focus-visible:outline-sea">View evaluation</button>}
        </div>
        {job.status === 'Training' && <label className="mt-3 block text-xs">Demo training {job.progress}%<progress max="100" value={job.progress} className="mt-1 block w-full accent-sea" /></label>}
      </li>)}</ul>
      {error && <p role="alert" className="text-sm text-red">{error}</p>}
    </section>
    {selected?.status === 'Completed' && <EvaluationResults job={selected} />}
    {requesting && <TrainingRequestDialog onClose={() => setRequesting(false)} />}
  </>
}
