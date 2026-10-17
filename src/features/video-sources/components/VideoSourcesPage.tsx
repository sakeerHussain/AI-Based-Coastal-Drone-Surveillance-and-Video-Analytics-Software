import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../auth'
import { useFeedWallStore } from '../../feed-wall'
import { can } from '../../../lib/permissions'
import { formatIstTime } from '../../../lib/time'
import { useSourcesData } from '../api/sources'
import { useSourcesStore } from '../store/useSourcesStore'
import type { VideoSource } from '../types'
import { SourceDirectory } from './SourceDirectory'
import { SourceEditorDialog } from './SourceEditorDialog'
import { RecordingImportDialog } from './RecordingImportDialog'

export function VideoSourcesPage() {
  const actor = useAuthStore((state) => state.user)
  const query = useSourcesData()
  const { sources, drones, loaded, testing, imports, hydrate, testSource } = useSourcesStore()
  const [params, setParams] = useSearchParams()
  const [editor, setEditor] = useState<{ source?: VideoSource } | null>(null)
  const [importing, setImporting] = useState(false)
  const [notice, setNotice] = useState('')
  const canManage = can(actor, 'sources:manage')
  useEffect(() => { if (query.data) hydrate(query.data) }, [query.data, hydrate])
  if (query.isError) return <div role="alert" className="p-4 text-sm">Could not load video sources.
    <button type="button" onClick={() => void query.refetch()} className="ml-3 rounded border border-line bg-panel px-3 py-2 focus-visible:outline-2 focus-visible:outline-sea">Try again</button></div>
  if (!loaded) return <p role="status" className="p-4 text-sm text-mute">Loading video sources…</p>
  const selected = sources.find((source) => source.id === params.get('source')) ?? sources[0]
  const actionClass = 'rounded border border-line bg-panel px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'
  return <div className="flex min-h-full flex-col gap-3 p-4">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-xl font-bold tracking-tight">Video sources</h1><p className="mt-1 text-xs text-mute">Demo stream configuration and recording intake</p></div>
      {canManage && <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => { setNotice(''); setImporting(true) }} className={actionClass}>Simulate import</button>
        <button type="button" onClick={() => { setNotice(''); setEditor({}) }} className={`${actionClass} border-sea bg-sea text-panel`}>Add source</button>
      </div>}
    </header>
    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Video sources overview">
      {[
        ['Configured sources', sources.length, 'Current demo directory'],
        ['Connected sources', sources.filter((source) => source.status === 'Connected').length, 'Simulated connections'],
        ['Awaiting test', sources.filter((source) => source.status === 'Not tested').length, 'Configuration changed'],
        ['Recording imports', imports.length, 'Metadata-only demo jobs'],
      ].map(([label, value, detail]) => <div key={label} className="border border-l-2 border-line border-l-sea bg-panel p-4">
        <dt className="text-xs text-mute">{label}</dt><dd className="mt-2 text-3xl font-bold">{value}</dd><dd className="mt-1 text-xs text-mute">{detail}</dd>
      </div>)}
    </dl>
    {!canManage && <p className="text-xs text-mute">Viewing access · Supervisors and administrators configure sources and simulate imports</p>}
    <p role="status" aria-live="polite" className={notice ? 'border-l-2 border-sea bg-panel px-3 py-2 text-sm' : 'sr-only'}>{notice}</p>
    <div className="grid items-start gap-3 2xl:grid-cols-[minmax(0,1fr)_320px]">
      <SourceDirectory sources={sources} selectedId={selected?.id ?? ''} testing={testing} canManage={canManage}
        onSelect={(id) => setParams({ source: id }, { replace: true })} onEdit={(source) => setEditor({ source })}
        onTest={(id) => { setNotice('Running a simulated connection test…'); void testSource(id).then((result) => setNotice(result.message)) }} />
      {selected && <aside aria-labelledby="source-details-title" className="min-w-0 rounded border border-line bg-panel p-4">
        <h2 id="source-details-title" className="text-base font-semibold">Source details</h2>
        <dl className="mt-3 divide-y divide-line text-sm">
          {[
            ['Name', selected.name], ['Drone', selected.droneId], ['Protocol', selected.protocol],
            ['Demo status', selected.status], ['Enabled', selected.enabled ? 'Yes' : 'No'],
            ['Last test (IST)', selected.lastTested ? formatIstTime(selected.lastTested, true) : 'Not tested'], ['Stream address', selected.endpoint],
          ].map(([label, value]) => <div key={label} className="py-3"><dt className="text-xs text-mute">{label}</dt><dd className="mt-1 break-all">{value}</dd></div>)}
        </dl>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-sea">
          {selected.feedIndex !== null && <Link to="/feed-wall" onClick={() => {
            useFeedWallStore.getState().setLayout(3); useFeedWallStore.getState().setPage(Math.floor(selected.feedIndex! / 9))
          }} className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-sea">View existing feed</Link>}
          <Link to={`/archive?drone=${encodeURIComponent(selected.droneId)}`} className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-sea">View recordings</Link>
          <Link to={`/fleet?drone=${encodeURIComponent(selected.droneId)}`} className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-sea">View drone</Link>
        </div>
      </aside>}
    </div>
    <section aria-labelledby="import-queue-title" className="rounded border border-line bg-panel p-4">
      <h2 id="import-queue-title" className="text-base font-semibold">Demo import queue</h2>
      <p className="mt-1 text-xs text-mute">Progress is simulated. Completed jobs contain metadata only and do not create playable recordings.</p>
      {!imports.length ? <p className="py-6 text-sm text-mute">No recordings imported this session.</p> : <ul className="mt-3 divide-y divide-line">
        {imports.map((job) => <li key={job.id} className="grid gap-3 py-3 text-sm md:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0"><p className="break-words font-medium">{job.name}</p>
            <p className="mt-1 text-xs text-mute">{job.droneId} · {(job.size / 1024 / 1024).toFixed(2)} MB · {formatIstTime(job.createdAt, true)} IST</p></div>
          <div><p className="mb-2 text-xs">{job.status} · {job.progress}%</p>
            <div role="progressbar" aria-label={`Demo import: ${job.name}`} aria-valuenow={job.progress} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded bg-shoal">
              <div className="h-full bg-sea" style={{ width: `${job.progress}%` }} />
            </div></div>
        </li>)}
      </ul>}
    </section>
    {editor && canManage && <SourceEditorDialog source={editor.source} drones={drones} onClose={() => setEditor(null)} onSaved={setNotice} />}
    {importing && canManage && <RecordingImportDialog drones={drones} onClose={() => setImporting(false)} onQueued={setNotice} />}
  </div>
}
