import { Link } from 'react-router-dom'
import { useState } from 'react'
import { can } from '../../../lib/permissions'
import { useAuthStore } from '../../auth'
import { useDatasetsStore } from '../store/useDatasetsStore'
import type { DatasetRecord } from '../types'
export function DatasetVersions({ dataset }: { dataset: DatasetRecord }) {
  const user = useAuthStore((state) => state.user), [message, setMessage] = useState('')
  return <section className="rounded border border-line bg-panel p-4 text-sm" aria-label="Dataset versions">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">Version snapshots</h2>
      {can(user, 'datasets:manage') && <button type="button" onClick={() => setMessage(useDatasetsStore.getState().createVersion(dataset.id) || 'Version snapshot created.')}
        className="rounded border border-line px-3 py-2 text-sea focus-visible:outline-2 focus-visible:outline-sea">Create version</button>}</div>
    <p className="mt-2 text-xs text-mute">Versions preserve saved annotations. All sample frames must be reviewed before a new snapshot.</p>
    <ul className="mt-3 divide-y divide-line">{dataset.versions.map((version) => <li key={version.id} className="py-2">
      <details><summary className="cursor-pointer rounded p-1 focus-visible:outline-2 focus-visible:outline-sea"><span className="font-semibold">{version.name} · {version.frames.length} sample frames</span>
        <time className="ml-3 text-xs text-mute" dateTime={version.createdAt}>{new Date(version.createdAt).toLocaleDateString('en-GB')}</time></summary>
        <ul className="mt-2 space-y-2 border-l border-line pl-3 text-xs">{version.frames.map((frame) => <li key={frame.id}><p className="font-semibold">{frame.name}</p>
          {frame.boxes.length ? frame.boxes.map((box, index) => <p key={box.id} className="mt-1 text-mute">{index + 1}. {box.label} · Left {box.x.toFixed(1)}%, top {box.y.toFixed(1)}%, width {box.width.toFixed(1)}%, height {box.height.toFixed(1)}%</p>) : <p className="text-mute">No objects annotated.</p>}
        </li>)}</ul>
      </details>
    </li>)}</ul>
    {!dataset.versions.length && <p className="mt-2 text-mute">No version snapshots yet.</p>}
    {message && <p role="status" className="mt-2 text-sea">{message}</p>}
    {can(user, 'view:models') && <Link to="/models" className="mt-3 inline-block text-sea underline focus-visible:outline-2 focus-visible:outline-sea">Open training and evaluation</Link>}
  </section>
}
