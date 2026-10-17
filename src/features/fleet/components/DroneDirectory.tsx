import { useState } from 'react'
import type { FleetDrone } from '../types'

const field = 'min-w-0 rounded border border-line bg-panel px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-sea'

export function DroneDirectory({ drones, selectedId, onSelect }: { drones: FleetDrone[]; selectedId: string; onSelect: (id: string) => void }) {
  const [search, setSearch] = useState('')
  const [flight, setFlight] = useState('')
  const [link, setLink] = useState('')
  const [page, setPage] = useState(0)
  const filtered = drones.filter((drone) => (!flight || drone.flightStatus === flight) && (!link || drone.linkStatus === link)
    && `${drone.id} ${drone.location}`.toLowerCase().includes(search.trim().toLowerCase()))
  const pages = Math.max(1, Math.ceil(filtered.length / 6))
  const current = Math.min(page, pages - 1)
  return <section aria-labelledby="drone-directory-title" className="min-w-0 rounded border border-line bg-panel p-4">
    <h2 id="drone-directory-title" className="text-base font-semibold">Drone directory</h2>
    <p className="mt-1 text-xs text-mute">Select a drone to inspect its demo telemetry, missions and recordings.</p>
    <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,2fr)_1fr_1fr_auto]">
      <label className="grid gap-1 text-xs text-mute">Search drones<input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0) }} placeholder="Drone ID or location" className={field} /></label>
      <label className="grid gap-1 text-xs text-mute">Flight status<select value={flight} onChange={(event) => { setFlight(event.target.value); setPage(0) }} className={field}>
        <option value="">All flight statuses</option><option>Monitoring</option><option>Not available</option></select></label>
      <label className="grid gap-1 text-xs text-mute">Link status<select value={link} onChange={(event) => { setLink(event.target.value); setPage(0) }} className={field}>
        <option value="">All link statuses</option><option>Connected</option><option>Unavailable</option></select></label>
      <button type="button" onClick={() => { setSearch(''); setFlight(''); setLink(''); setPage(0) }} className={`self-end ${field}`}>Clear filters</button>
    </div>
    <p role="status" className="my-4 text-xs text-mute">{filtered.length} of {drones.length} drones · Telemetry is simulated</p>
    {!filtered.length ? <p className="py-8 text-sm text-mute">No drones match these filters.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm">
      <caption className="sr-only">Demo drone fleet</caption>
      <thead className="border-b border-line text-xs text-mute"><tr>{['Drone', 'Flight status', 'Link', 'Battery', 'Altitude', 'Ground speed'].map((label) => <th key={label} scope="col" className="px-3 py-3">{label}</th>)}</tr></thead>
      <tbody className="divide-y divide-line">{filtered.slice(current * 6, current * 6 + 6).map((drone) => <tr key={drone.id} className={selectedId === drone.id ? 'bg-shoal/30' : 'hover:bg-paper'}>
        <th scope="row" className="px-3 py-4 font-medium"><label className="flex cursor-pointer items-start gap-2">
          <input type="radio" name="fleet-drone" checked={selectedId === drone.id} onChange={() => onSelect(drone.id)} aria-label={`Select drone: ${drone.id}`} className="mt-1 accent-sea focus-visible:outline-2 focus-visible:outline-sea" />
          <span>{drone.id}<span className="mt-1 block text-xs font-normal text-mute">{drone.location}</span></span></label></th>
        <td className="px-3 py-4">{drone.flightStatus}</td><td className="px-3 py-4"><span className={`border-l-2 pl-2 ${drone.linkStatus === 'Connected' ? 'border-green' : 'border-amber'}`}>{drone.linkStatus}</span></td>
        <td className="px-3 py-4">{drone.telemetry.battery}%</td><td className="px-3 py-4">{drone.telemetry.altitude} m</td><td className="px-3 py-4">{drone.telemetry.speed} m/s</td>
      </tr>)}</tbody>
    </table></div>}
    <div className="mt-4 flex items-center justify-end gap-3 text-xs text-mute">
      <button type="button" disabled={current === 0} onClick={() => setPage(current - 1)} className={`${field} disabled:opacity-40`}>Previous drones</button>
      <span>Page {current + 1} of {pages}</span>
      <button type="button" disabled={current >= pages - 1} onClick={() => setPage(current + 1)} className={`${field} disabled:opacity-40`}>Next drones</button>
    </div>
  </section>
}
