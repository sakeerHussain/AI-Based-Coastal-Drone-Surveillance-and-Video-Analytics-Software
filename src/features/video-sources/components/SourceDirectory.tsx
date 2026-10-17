import { useState } from 'react'
import { formatIstTime } from '../../../lib/time'
import type { VideoSource } from '../types'

const field = 'min-w-0 rounded border border-line bg-panel px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-sea'

export function SourceDirectory({ sources, selectedId, testing, canManage, onSelect, onEdit, onTest }: {
  sources: VideoSource[]; selectedId: string; testing: Record<string, boolean>; canManage: boolean
  onSelect: (id: string) => void; onEdit: (source: VideoSource) => void; onTest: (id: string) => void
}) {
  const [search, setSearch] = useState('')
  const [protocol, setProtocol] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const filtered = sources.filter((source) => (!protocol || source.protocol === protocol) && (!status || source.status === status)
    && `${source.name} ${source.droneId}`.toLowerCase().includes(search.trim().toLowerCase()))
  const pages = Math.max(1, Math.ceil(filtered.length / 6))
  const current = Math.min(page, pages - 1)
  return <section aria-labelledby="source-directory-title" className="min-w-0 rounded border border-line bg-panel p-4">
    <h2 id="source-directory-title" className="text-base font-semibold">Source directory</h2>
    <p className="mt-1 text-xs text-mute">Connection states and tests are simulated.</p>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_1fr_1fr_auto]">
      <label className="grid gap-1 text-xs text-mute">Search sources<input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0) }} placeholder="Source or drone" className={field} /></label>
      <label className="grid gap-1 text-xs text-mute">Protocol<select value={protocol} onChange={(event) => { setProtocol(event.target.value); setPage(0) }} className={field}>
        <option value="">All protocols</option><option>RTSP</option><option>RTMP</option><option>SRT</option></select></label>
      <label className="grid gap-1 text-xs text-mute">Connection status<select value={status} onChange={(event) => { setStatus(event.target.value); setPage(0) }} className={field}>
        <option value="">All statuses</option><option>Connected</option><option>Not tested</option><option>Disabled</option></select></label>
      <button type="button" onClick={() => { setSearch(''); setProtocol(''); setStatus(''); setPage(0) }} className={`self-end ${field}`}>Clear filters</button>
    </div>
    <p role="status" className="my-4 text-xs text-mute">{filtered.length} of {sources.length} sources</p>
    {!filtered.length ? <p className="py-8 text-sm text-mute">No sources match these filters.</p> : <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm"><caption className="sr-only">Demo video sources</caption>
        <thead className="border-b border-line text-xs text-mute"><tr>
          {['Source', 'Protocol', 'Status', 'Last test (IST)', ...(canManage ? ['Actions'] : [])].map((label) => <th scope="col" key={label} className="px-3 py-3">{label}</th>)}
        </tr></thead>
        <tbody className="divide-y divide-line">{filtered.slice(current * 6, current * 6 + 6).map((source) => <tr key={source.id} className={selectedId === source.id ? 'bg-shoal/30' : 'hover:bg-paper'}>
          <th scope="row" className="px-3 py-4 font-medium"><label className="flex cursor-pointer items-start gap-2">
            <input type="radio" name="selected-source" checked={selectedId === source.id} onChange={() => onSelect(source.id)} aria-label={`Select source: ${source.name}`} className="mt-1 accent-sea focus-visible:outline-2 focus-visible:outline-sea" />
            <span>{source.name}<span className="mt-1 block text-xs font-normal text-mute">{source.droneId}</span></span></label></th>
          <td className="px-3 py-4">{source.protocol}</td>
          <td className="px-3 py-4"><span className={`border-l-2 pl-2 ${source.status === 'Connected' ? 'border-green' : 'border-amber'}`}>{testing[source.id] ? 'Testing…' : source.status}</span></td>
          <td className="px-3 py-4 text-xs text-mute">{source.lastTested ? formatIstTime(source.lastTested, true) : 'Not tested'}</td>
          {canManage && <td className="px-3 py-4"><div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => onEdit(source)} aria-label={`Edit source: ${source.name}`} className="text-sea underline focus-visible:outline-2 focus-visible:outline-sea">Edit</button>
            <button type="button" disabled={!source.enabled || testing[source.id]} onClick={() => onTest(source.id)} aria-label={`Test source: ${source.name}`} className="text-sea underline focus-visible:outline-2 focus-visible:outline-sea disabled:opacity-50">Test</button>
          </div></td>}
        </tr>)}</tbody>
      </table></div>}
    <div className="mt-4 flex items-center justify-end gap-3 text-xs text-mute">
      <button type="button" disabled={current === 0} onClick={() => setPage(current - 1)} className={`${field} disabled:opacity-40`}>Previous sources</button>
      <span>Page {current + 1} of {pages}</span>
      <button type="button" disabled={current >= pages - 1} onClick={() => setPage(current + 1)} className={`${field} disabled:opacity-40`}>Next sources</button>
    </div>
  </section>
}
