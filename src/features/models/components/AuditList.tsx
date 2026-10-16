import { useAuditStore } from '../../../lib/useAuditStore'
import { formatIstTime } from '../../../lib/time'

export function AuditList() {
  const entries = useAuditStore((state) => state.entries)
  return <section className="mt-6 border-t border-line pt-4 text-sm" aria-labelledby="audit-title">
    <h3 id="audit-title" className="font-semibold">Audit log</h3>
    <p className="mt-1 text-xs text-mute">Zone rule changes, model approvals and dataset requests from this session.</p>
    {!entries.length ? <p className="mt-3 text-mute">No changes recorded yet.</p> : <ol className="mt-2 divide-y divide-line">
      {[...entries].reverse().map((entry) => <li key={entry.id} className="flex flex-wrap gap-x-3 gap-y-1 py-3">
        <time dateTime={new Date(entry.createdAt).toISOString()} className="text-xs text-mute">{formatIstTime(entry.createdAt, true)} IST</time>
        <span className="min-w-0 flex-1 break-words">
          <span className="font-medium">{entry.actor}</span> · {entry.action} · {entry.entityId}
          {entry.after.stage && <span className="block text-xs text-mute">Stage: {entry.after.stage}</span>}
          {entry.after.threshold && <span className="block text-xs text-mute">Dwell time: {entry.after.threshold}; sensitivity: {entry.after.sensitivity}%</span>}
        </span>
      </li>)}
    </ol>}
  </section>
}
