import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import type { Incident } from '../../incidents'
import { formatIstTime } from '../../../lib/time'

const field = 'rounded border border-line bg-panel px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-sea'
const bars = { high: 'border-red', medium: 'border-amber', info: 'border-green' }
const severityLabels = { high: 'High', medium: 'Medium', info: 'Info' }
const istDate = (value: number) => new Date(value + 330 * 60_000).toISOString().slice(0, 10)

export function ArchivePage() {
  const [search, setSearch] = useState('')
  const [params, setParams] = useSearchParams()
  const drone = params.get('drone') ?? ''
  function setDrone(id: string) {
    setParams((previous) => { const next = new URLSearchParams(previous); if (id) next.set('drone', id); else next.delete('drone'); return next })
  }
  const [severity, setSeverity] = useState('')
  const [date, setDate] = useState('')
  const query = useQuery({
    queryKey: ['incidents'], staleTime: Infinity,
    queryFn: async ({ signal }): Promise<{ records: Record<string, Incident> }> => {
      const response = await fetch('/api/incidents', { signal })
      if (!response.ok) throw new Error('Could not load recordings.')
      return response.json()
    },
  })
  if (query.isPending) return <p role="status" className="p-4 text-sm text-mute">Loading recordings…</p>
  if (query.isError) return <div role="alert" className="p-4 text-sm">Could not load recordings.
    <button className={`ml-3 ${field}`} onClick={() => void query.refetch()}>Try again</button></div>
  const records = Object.values(query.data.records).sort((a, b) => b.detectedAt - a.detectedAt)
  const filtered = records.filter((record) => (!drone || record.droneId === drone)
    && (!severity || record.severity === severity) && (!date || istDate(record.detectedAt) === date)
    && `${record.title} ${record.droneId} ${record.station}`.toLowerCase().includes(search.trim().toLowerCase()))
  const totalMinutes = records.reduce((sum, record) => sum + record.playback.durationSeconds / 60, 0)
  return <div className="flex min-h-full flex-col gap-3 p-4">
    <header className="flex flex-wrap items-baseline justify-between gap-2">
      <h1 className="text-xl font-bold tracking-tight">Archive and playback</h1>
      <p className="text-xs text-mute">Recorded events from the current demo</p>
    </header>
    <dl className="grid gap-3 sm:grid-cols-3" aria-label="Archive overview">
      {[
        ['Available recordings', records.length, 'Incident-linked recordings'],
        ['Recorded minutes', totalMinutes.toLocaleString(), 'Combined playback duration'],
        ['Recorded drones', new Set(records.map((record) => record.droneId)).size, 'In the current archive'],
      ].map(([label, value, detail]) => <div key={label} className="border border-l-2 border-line border-l-sea bg-panel p-4">
        <dt className="text-xs text-mute">{label}</dt><dd className="mt-2 text-3xl font-bold">{value}</dd>
        <dd className="mt-1 text-xs text-mute">{detail}</dd>
      </div>)}
    </dl>
    <section className="rounded border border-line bg-panel p-4" aria-labelledby="recordings-title">
      <h2 id="recordings-title" className="text-base font-semibold">Find a recording</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_auto]">
        <label className="grid gap-1 text-xs text-mute">Search recordings
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Title, drone or station" className={field} /></label>
        <label className="grid gap-1 text-xs text-mute">Drone
          <select value={drone} onChange={(event) => setDrone(event.target.value)} className={field}>
            <option value="">All drones</option>{[...new Set([...records.map((record) => record.droneId), ...(drone ? [drone] : [])])].sort().map((id) => <option key={id}>{id}</option>)}
          </select></label>
        <label className="grid gap-1 text-xs text-mute">Severity
          <select value={severity} onChange={(event) => setSeverity(event.target.value)} className={field}>
            <option value="">All severities</option>{Object.entries(severityLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select></label>
        <label className="grid gap-1 text-xs text-mute">Event date (IST)
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className={`min-w-0 ${field}`} /></label>
        <button type="button" className={`self-end ${field}`} onClick={() => { setSearch(''); setDrone(''); setSeverity(''); setDate('') }}>Clear filters</button>
      </div>
      <p role="status" className="my-4 text-xs text-mute">{filtered.length} of {records.length} recordings · Playback opens in incident review</p>
      {!filtered.length ? <p className="py-8 text-sm text-mute">No recordings match these filters.</p> : <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Available recorded events</caption>
          <thead className="border-b border-line text-xs text-mute"><tr>
            {['Recording', 'Drone', 'Event time (IST)', 'Duration', 'Severity', 'Playback'].map((label) => <th key={label} scope="col" className="px-3 py-3">{label}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-line">{filtered.map((record) => <tr key={record.id} className="hover:bg-paper">
            <th scope="row" className={`border-l-4 px-3 py-4 font-semibold ${bars[record.severity]}`}>
              {record.title}<span className="mt-1 block text-xs font-normal text-mute">{record.station}</span></th>
            <td className="px-3 py-4">{record.droneId}</td>
            <td className="px-3 py-4"><time dateTime={new Date(record.detectedAt).toISOString()}>{formatIstTime(record.detectedAt, true)}</time></td>
            <td className="px-3 py-4">{record.playback.durationSeconds / 60} min</td>
            <td className="px-3 py-4">{severityLabels[record.severity]}</td>
            <td className="px-3 py-4"><Link to={`/incidents/${record.id}`} aria-label={`Play recording: ${record.title}`} className="whitespace-nowrap text-sea underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-sea">View playback</Link></td>
          </tr>)}</tbody>
        </table>
      </div>}
    </section>
  </div>
}
