import { useState } from 'react'
import { formatIstTime } from '../../../lib/time'
import type { FlightMission } from '../types'

const field = 'min-w-0 rounded border border-line bg-panel px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-sea'
const istDate = (value: number) => new Date(value + 330 * 60_000).toISOString().slice(0, 10)

export function FlightHistory({ droneId, missions, selectedId, onSelect }: {
  droneId: string; missions: FlightMission[]; selectedId?: string; onSelect: (id: string) => void
}) {
  const [status, setStatus] = useState('')
  const [date, setDate] = useState('')
  const filtered = missions.filter((mission) => (!status || mission.status === status) && (!date || istDate(mission.startedAt) === date))
  return <section aria-labelledby="flight-history-title" className="min-w-0 rounded border border-line bg-panel p-4">
    <h2 id="flight-history-title" className="text-base font-semibold">Flight history · {droneId}</h2>
    <p className="mt-1 text-xs text-mute">Demo mission records and recorded routes</p>
    <div className="mt-4 flex flex-wrap items-end gap-3">
      <label className="grid min-w-0 flex-1 gap-1 text-xs text-mute">Mission status<select value={status} onChange={(event) => setStatus(event.target.value)} className={field}>
        <option value="">All mission statuses</option><option>In progress</option><option>Completed</option></select></label>
      <label className="grid min-w-0 flex-1 gap-1 text-xs text-mute">Flight date (IST)<input type="date" value={date} onChange={(event) => setDate(event.target.value)} className={field} /></label>
      <button type="button" onClick={() => { setStatus(''); setDate('') }} className={field}>Clear flight filters</button>
    </div>
    <p role="status" className="my-4 text-xs text-mute">{filtered.length} of {missions.length} missions</p>
    {!filtered.length ? <p className="py-8 text-sm text-mute">{missions.length ? 'No missions match these filters.' : 'No demo flight history is available for this drone.'}</p> : <ol className="divide-y divide-line">
      {filtered.map((mission) => <li key={mission.id} className={selectedId === mission.id ? 'bg-shoal/30' : ''}>
        <label className="flex cursor-pointer items-start gap-3 px-3 py-4 text-sm">
          <input type="radio" name="fleet-mission" checked={selectedId === mission.id} onChange={() => onSelect(mission.id)} aria-label={`Select mission: ${mission.name}`} className="mt-1 accent-sea focus-visible:outline-2 focus-visible:outline-sea" />
          <span className="min-w-0 flex-1"><span className="block font-semibold">{mission.name}</span>
            <span className="mt-1 block text-xs text-mute">{formatIstTime(mission.startedAt, true)} IST</span>
            <span className="mt-1 block text-xs text-mute">{mission.status} · {mission.distanceKm.toFixed(2)} km recorded track</span></span>
        </label>
      </li>)}
    </ol>}
  </section>
}
