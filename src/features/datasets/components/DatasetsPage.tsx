import { useEffect, useState } from 'react'
import { can } from '../../../lib/permissions'
import { useAuthStore } from '../../auth'
import { useDatasets } from '../api/datasets'
import { useDatasetsStore } from '../store/useDatasetsStore'
import { DatasetDirectory } from './DatasetDirectory'
import { DatasetImportDialog } from './DatasetImportDialog'
import { DatasetVersions } from './DatasetVersions'
import { AnnotationWorkspace } from './AnnotationWorkspace'
export function DatasetsPage() {
  const query = useDatasets(), user = useAuthStore((state) => state.user)
  const datasets = useDatasetsStore((state) => state.datasets), hydrate = useDatasetsStore((state) => state.hydrate)
  const [selectedId, setSelectedId] = useState(''), [importing, setImporting] = useState(false), [frameId, setFrameId] = useState('')
  useEffect(() => { if (query.data) hydrate(query.data) }, [query.data, hydrate])
  const dataset = datasets.find((item) => item.id === selectedId) ?? datasets[0], frame = dataset?.frames.find((item) => item.id === frameId)
  if (query.isPending) return <p role="status" className="p-4 text-sm text-mute">Loading datasets…</p>
  if (query.isError) return <div role="alert" className="p-4"><p>Could not load datasets.</p><button onClick={() => void query.refetch()} className="mt-3 border border-line p-2 focus-visible:outline-2 focus-visible:outline-sea">Try again</button></div>
  return <div className="flex min-h-full flex-col gap-3 p-4">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-xl font-bold tracking-tight">Datasets and annotation</h1>
      <p className="mt-1 text-xs text-mute">Curate coastal imagery and preserve training versions · Demo workspace</p></div>
      {can(user, 'datasets:manage') && <button onClick={() => setImporting(true)} className="rounded bg-sea px-4 py-2 text-sm font-semibold text-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">Simulate frame import</button>}</header>
    <div className="grid gap-3 sm:grid-cols-3">{[
      ['Datasets', datasets.length], ['Corpus frames', datasets.reduce((sum, item) => sum + item.frameCount, 0).toLocaleString('en-GB')],
      ['Version snapshots', datasets.reduce((sum, item) => sum + item.versions.length, 0)],
    ].map(([label, value]) => <div key={label} className="border border-line border-l-2 border-l-sea bg-panel p-3"><p className="text-xs text-mute">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>)}</div>
    <div className="grid items-start gap-3 xl:grid-cols-[300px_minmax(0,1fr)]"><DatasetDirectory datasets={datasets} selectedId={dataset?.id ?? ''} onSelect={(id) => { setSelectedId(id); setFrameId('') }} />
      {dataset && <div className="min-w-0 space-y-3"><section className="rounded border border-line bg-panel p-4"><h2 className="break-words text-lg font-bold">{dataset.name}</h2>
        <p className="mt-1 text-xs text-mute">{dataset.frames.length} interactive sample frames from {dataset.frameCount.toLocaleString('en-GB')} corpus frames. Edits affect demo samples only.</p>
        <ul className="mt-3 divide-y divide-line">{dataset.frames.map((item) => <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
          <div><p className="break-words font-semibold">{item.name}</p><p className="mt-1 text-xs text-mute">{item.boxes.length} annotations · {item.reviewed ? 'Reviewed' : 'Awaiting review'}</p></div>
          {can(user, 'datasets:annotate') && <button onClick={() => setFrameId(item.id)} className="rounded border border-line px-3 py-2 text-sea focus-visible:outline-2 focus-visible:outline-sea" aria-label={`Annotate ${item.name}`}>Annotate</button>}
        </li>)}</ul></section><DatasetVersions key={dataset.id} dataset={dataset} /></div>}
    </div>
    {importing && <DatasetImportDialog onClose={() => setImporting(false)} />}
    {frame && <AnnotationWorkspace key={frame.id} datasetId={dataset.id} frame={frame} onClose={() => setFrameId('')} />}
  </div>
}
