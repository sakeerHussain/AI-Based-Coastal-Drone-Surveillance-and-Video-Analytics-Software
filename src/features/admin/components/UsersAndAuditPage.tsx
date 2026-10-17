import { useState } from 'react'
import { useAuthStore } from '../../auth'
import { can } from '../../../lib/permissions'
import { useAuditStore } from '../../../lib/useAuditStore'
import { formatIstTime } from '../../../lib/time'
import { demoRoles } from '../../../mocks/auth'

const field = 'rounded border border-line bg-panel px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-sea'

export function UsersAndAuditPage() {
  const user = useAuthStore((state) => state.user)
  const entries = useAuditStore((state) => state.entries)
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('')
  const filtered = [...entries].reverse().filter((entry) => (!action || entry.action === action)
    && `${entry.actor} ${entry.action} ${entry.entityId}`.toLowerCase().includes(search.trim().toLowerCase()))
  const roleLabel = demoRoles.find((role) => role.value === user?.role)?.label
  return <div className="flex min-h-full flex-col gap-3 p-4">
    <header className="flex flex-wrap items-baseline justify-between gap-2">
      <h1 className="text-xl font-bold tracking-tight">Users and audit</h1>
      <p className="text-xs text-mute">Read-only demo access and session activity</p>
    </header>
    <dl className="grid gap-3 sm:grid-cols-3" aria-label="Access and audit overview">
      {[
        ['Current role', roleLabel ?? 'Unavailable', 'Signed-in demo user'],
        ['Available roles', demoRoles.length, 'Roles configured in the demo'],
        ['Audit entries', entries.length, 'Recorded during this session'],
      ].map(([label, value, detail]) => <div key={label} className="border border-l-2 border-line border-l-sea bg-panel p-4">
        <dt className="text-xs text-mute">{label}</dt><dd className="mt-2 text-2xl font-bold">{value}</dd>
        <dd className="mt-1 text-xs text-mute">{detail}</dd>
      </div>)}
    </dl>
    <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <section className="rounded border border-line bg-panel p-4" aria-labelledby="current-user-title">
        <h2 id="current-user-title" className="text-base font-semibold">Current user</h2>
        <p className="mt-1 text-xs text-mute">The demo exposes the signed-in user only.</p>
        <dl className="mt-4 divide-y divide-line text-sm">
          {[
            ['Name', user?.name], ['Police ID', user?.policeId], ['Role', roleLabel],
          ].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-2 py-3">
            <dt className="text-mute">{label}</dt><dd className="font-medium">{value ?? 'Unavailable'}</dd>
          </div>)}
        </dl>
      </section>
      <section className="min-w-0 rounded border border-line bg-panel p-4" aria-labelledby="role-access-title">
        <h2 id="role-access-title" className="text-base font-semibold">Page access by role</h2>
        <p className="mt-1 text-xs text-mute">Read-only access for archive, reporting and audit.</p>
        <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[480px] text-left text-sm">
          <caption className="sr-only">Read-only page access by demo role</caption>
          <thead className="border-b border-line text-xs text-mute"><tr>
            {['Role', 'Archive and playback', 'Reports', 'Users and audit'].map((label) => <th scope="col" key={label} className="px-3 py-3">{label}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-line">{demoRoles.map((role) => <tr key={role.value}>
            <th scope="row" className="px-3 py-3 font-medium">{role.label}</th>
            {(['view:archive', 'view:reports', 'view:users-audit'] as const).map((permission) => <td key={permission} className="px-3 py-3">{can({ role: role.value }, permission) ? 'Allowed' : 'Restricted'}</td>)}
          </tr>)}</tbody>
        </table></div>
      </section>
    </div>
    <section className="min-w-0 rounded border border-line bg-panel p-4" aria-labelledby="session-audit-title">
      <h2 id="session-audit-title" className="text-base font-semibold">Session audit log</h2>
      <p className="mt-1 text-xs text-mute">Zone rule changes, model approvals and dataset requests recorded in this session.</p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="grid min-w-0 flex-1 gap-1 text-xs text-mute">Search audit log
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Person, action or entity" className={field} /></label>
        <label className="grid gap-1 text-xs text-mute">Action
          <select value={action} onChange={(event) => setAction(event.target.value)} className={field}>
            <option value="">All actions</option>{[...new Set(entries.map((entry) => entry.action))].sort().map((label) => <option key={label}>{label}</option>)}
          </select></label>
        <button type="button" onClick={() => { setSearch(''); setAction('') }} className={field}>Clear filters</button>
      </div>
      <p role="status" className="my-4 text-xs text-mute">{filtered.length} of {entries.length} entries</p>
      {!filtered.length ? <p className="py-6 text-sm text-mute">{entries.length ? 'No audit entries match these filters.' : 'No changes recorded yet.'}</p> : <ol className="divide-y divide-line">
        {filtered.map((entry) => <li key={entry.id} className="grid gap-3 py-4 lg:grid-cols-[180px_minmax(0,1fr)]">
          <time dateTime={new Date(entry.createdAt).toISOString()} className="text-xs text-mute">{formatIstTime(entry.createdAt, true)} IST</time>
          <div className="min-w-0 break-words text-sm">
            <p><span className="font-semibold">{entry.actor}</span> · {entry.action}</p>
            <p className="mt-1 text-xs text-mute">{entry.entityId}</p>
            <details className="mt-2"><summary className="w-fit cursor-pointer text-xs text-sea focus-visible:outline-2 focus-visible:outline-sea">View recorded changes</summary>
              <dl className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
                <div className="rounded border border-line bg-paper p-3"><dt className="font-semibold">Before</dt><dd className="mt-1 whitespace-pre-wrap">{entry.before ? JSON.stringify(entry.before, null, 2) : 'No previous value'}</dd></div>
                <div className="rounded border border-line bg-paper p-3"><dt className="font-semibold">After</dt><dd className="mt-1 whitespace-pre-wrap">{JSON.stringify(entry.after, null, 2)}</dd></div>
              </dl>
            </details>
          </div>
        </li>)}
      </ol>}
    </section>
  </div>
}
