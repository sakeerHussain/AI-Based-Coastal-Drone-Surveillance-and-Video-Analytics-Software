import { useState } from 'react'
import { useAuditStore } from '../../../lib/useAuditStore'
import { formatIstTime } from '../../../lib/time'

const field = 'min-w-0 rounded border border-line bg-panel px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-sea'
const istDate = (value: number) => new Date(value + 330 * 60_000).toISOString().slice(0, 10)

export function AuditLog() {
  const entries = useAuditStore((state) => state.entries)
  const [search, setSearch] = useState('')
  const [actor, setActor] = useState('')
  const [action, setAction] = useState('')
  const [entity, setEntity] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const invalidRange = !!from && !!to && from > to
  const filtered = [...entries].reverse().filter((entry) => !invalidRange && (!actor || entry.actor === actor)
    && (!action || entry.action === action) && entry.entityId.toLowerCase().includes(entity.trim().toLowerCase())
    && (!from || istDate(entry.createdAt) >= from) && (!to || istDate(entry.createdAt) <= to)
    && `${entry.actor} ${entry.action} ${entry.entityId} ${JSON.stringify(entry.before)} ${JSON.stringify(entry.after)}`.toLowerCase().includes(search.trim().toLowerCase()))
  return <section aria-labelledby="session-audit-title" className="min-w-0 rounded border border-line bg-panel p-4">
    <h2 id="session-audit-title" className="text-base font-semibold">Session audit log</h2>
    <p className="mt-1 text-xs text-mute">User changes, zone rules, model approvals and dataset requests recorded in this session.</p>
    <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-4">
      <label className="grid gap-1 text-xs text-mute md:col-span-2">Search audit log
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people, actions, entities or changes" className={field} /></label>
      <label className="grid gap-1 text-xs text-mute">Person
        <select value={actor} onChange={(event) => setActor(event.target.value)} className={field}>
          <option value="">All people</option>{[...new Set(entries.map((entry) => entry.actor))].sort().map((label) => <option key={label}>{label}</option>)}
        </select></label>
      <label className="grid gap-1 text-xs text-mute">Action
        <select value={action} onChange={(event) => setAction(event.target.value)} className={field}>
          <option value="">All actions</option>{[...new Set(entries.map((entry) => entry.action))].sort().map((label) => <option key={label}>{label}</option>)}
        </select></label>
      <label className="grid gap-1 text-xs text-mute">Entity
        <input type="search" value={entity} onChange={(event) => setEntity(event.target.value)} placeholder="Police ID, zone or model" className={field} /></label>
      <label className="grid gap-1 text-xs text-mute">From date (IST)
        <input type="date" value={from} max={to || undefined} onChange={(event) => setFrom(event.target.value)} aria-invalid={invalidRange} aria-describedby={invalidRange ? 'audit-date-error' : undefined} className={field} /></label>
      <label className="grid gap-1 text-xs text-mute">To date (IST)
        <input type="date" value={to} min={from || undefined} onChange={(event) => setTo(event.target.value)} aria-invalid={invalidRange} aria-describedby={invalidRange ? 'audit-date-error' : undefined} className={field} /></label>
      <button type="button" className={`self-end ${field}`} onClick={() => { setSearch(''); setActor(''); setAction(''); setEntity(''); setFrom(''); setTo('') }}>Clear filters</button>
    </div>
    {invalidRange && <p id="audit-date-error" role="alert" className="mt-3 text-sm text-red">Choose a from date on or before the to date.</p>}
    <p role="status" className="my-4 text-xs text-mute">{filtered.length} of {entries.length} entries</p>
    {!filtered.length ? <p className="py-6 text-sm text-mute">{entries.length ? 'No audit entries match these filters.' : 'No changes recorded yet.'}</p> : <ol className="divide-y divide-line">
      {filtered.map((entry) => <li key={entry.id} className="grid gap-3 py-4 lg:grid-cols-[180px_minmax(0,1fr)]">
        <time dateTime={new Date(entry.createdAt).toISOString()} className="text-xs text-mute">{formatIstTime(entry.createdAt, true)} IST</time>
        <div className="min-w-0 break-words text-sm">
          <p><span className="font-semibold">{entry.actor}</span> · {entry.action}</p>
          <p className="mt-1 text-xs text-mute">{entry.entityId}</p>
          <details className="mt-2"><summary className="w-fit cursor-pointer text-xs text-sea focus-visible:outline-2 focus-visible:outline-sea">View recorded changes</summary>
            <dl className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
              {([['Before', entry.before], ['After', entry.after]] as const).map(([label, values]) => <div key={label} className="min-w-0 rounded border border-line bg-paper p-3">
                <dt className="font-semibold">{label}</dt>
                <dd className="mt-2">{values ? <dl className="space-y-1">{Object.entries(values).map(([key, value]) => <div key={key} className="flex flex-wrap gap-x-2">
                  <dt className="text-mute">{key}:</dt><dd className="whitespace-pre-wrap break-words">{value}</dd>
                </div>)}</dl> : 'No previous value'}</dd>
              </div>)}
            </dl>
          </details>
        </div>
      </li>)}
    </ol>}
  </section>
}
