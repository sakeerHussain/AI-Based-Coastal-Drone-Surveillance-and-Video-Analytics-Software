import { formatIstTime } from '../../../lib/time'
import { useIncidentsStore } from '../store/useIncidentsStore'

export function RecordOfActions({ incidentId }: { incidentId: string }) {
  const entries = useIncidentsStore((state) => state.history[incidentId])
  return (
    <section className="mt-6" aria-labelledby="record-of-actions-title">
      <h2 id="record-of-actions-title" className="font-semibold">Record of actions</h2>
      <ol aria-live="polite" aria-relevant="additions" className="mt-2 divide-y divide-line border-y border-line text-sm">
        {entries.map((entry) => (
          <li key={entry.id} className="grid grid-cols-[3rem_6rem_minmax(0,1fr)] gap-3 py-2">
            <time dateTime={new Date(entry.createdAt).toISOString()} className="text-mute">{formatIstTime(entry.createdAt)}</time>
            <span className="break-words font-medium">{entry.person}</span>
            <span>{entry.text}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
