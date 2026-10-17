import { lazy, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useIncidentsStore, type Incident } from '../../incidents'
import { formatIstTime } from '../../../lib/time'

const ReportsCharts = lazy(() => import('./ReportsCharts'))
const bars = { high: 'border-red', medium: 'border-amber', info: 'border-green' }
const labels = { high: 'High', medium: 'Medium', info: 'Info' }

export function ReportsPage() {
  const acknowledged = useIncidentsStore((state) => state.acknowledged)
  const query = useQuery({
    queryKey: ['incidents'], staleTime: Infinity,
    queryFn: async ({ signal }): Promise<{ records: Record<string, Incident> }> => {
      const response = await fetch('/api/incidents', { signal })
      if (!response.ok) throw new Error('Could not load report data.')
      return response.json()
    },
  })
  if (query.isPending) return <p role="status" className="p-4 text-sm text-mute">Loading reports…</p>
  if (query.isError) return <div role="alert" className="p-4 text-sm">Could not load report data.
    <button onClick={() => void query.refetch()} className="ml-3 rounded border border-line bg-panel px-3 py-2 focus-visible:outline-2 focus-visible:outline-sea">Try again</button></div>
  const records = Object.values(query.data.records).sort((a, b) => b.detectedAt - a.detectedAt)
  const metrics = [
    { label: 'Recorded events', value: records.length, detail: 'Current demo records', bar: 'border-l-sea' },
    { label: 'Open events', value: records.filter((record) => record.status === 'Open').length, detail: 'Recorded event status', bar: 'border-l-amber' },
    { label: 'Resolved events', value: records.filter((record) => record.status === 'Resolved').length, detail: 'Recorded event status', bar: 'border-l-green' },
    { label: 'Acknowledged events', value: records.filter((record) => acknowledged[record.id]).length, detail: 'Acknowledged this session', bar: 'border-l-sea' },
  ]
  return <div className="flex min-h-full flex-col gap-3 p-4">
    <header className="flex flex-wrap items-baseline justify-between gap-2">
      <h1 className="text-xl font-bold tracking-tight">Reports</h1>
      <p className="text-xs text-mute">Current demo event summary</p>
    </header>
    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Reports overview">
      {metrics.map((metric) => <div key={metric.label} className={`border border-l-2 border-line bg-panel p-4 ${metric.bar}`}>
        <dt className="text-xs text-mute">{metric.label}</dt><dd className="mt-2 text-3xl font-bold">{metric.value}</dd>
        <dd className="mt-1 text-xs text-mute">{metric.detail}</dd>
      </div>)}
    </dl>
    <Suspense fallback={<p role="status" className="p-4 text-sm text-mute">Loading report charts…</p>}>
      <ReportsCharts records={records} />
    </Suspense>
    <section className="rounded border border-line bg-panel p-4" aria-labelledby="report-events-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="report-events-title" className="text-base font-semibold">Event register</h2>
        <p className="text-xs text-mute">All available records · Times in IST</p>
      </div>
      {!records.length ? <p className="py-8 text-sm text-mute">No recorded events available.</p> : <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <caption className="sr-only">Current demo event register</caption>
          <thead className="border-b border-line text-xs text-mute"><tr>
            {['Event', 'Drone', 'Detected (IST)', 'Severity', 'Status'].map((label) => <th key={label} scope="col" className="px-3 py-3">{label}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-line">{records.map((record) => <tr key={record.id} className="hover:bg-paper">
            <th scope="row" className={`border-l-4 px-3 py-4 font-semibold ${bars[record.severity]}`}>
              <Link to={`/incidents/${record.id}`} className="focus-visible:outline-2 focus-visible:outline-sea">{record.title}</Link>
              <span className="mt-1 block text-xs font-normal text-mute">{record.station}</span>
            </th>
            <td className="px-3 py-4">{record.droneId}</td>
            <td className="px-3 py-4"><time dateTime={new Date(record.detectedAt).toISOString()}>{formatIstTime(record.detectedAt, true)}</time></td>
            <td className="px-3 py-4">{labels[record.severity]}</td>
            <td className="px-3 py-4">{acknowledged[record.id] ? 'Acknowledged' : record.status}</td>
          </tr>)}</tbody>
        </table>
      </div>}
    </section>
  </div>
}
