import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Incident } from '../../incidents'

const tick = { fill: 'var(--color-mute)', fontSize: 11 }
const tooltipStyle = { background: 'var(--color-panel)', border: '1px solid var(--color-line)', color: 'var(--color-ink)', fontSize: 12 }
const focus = '[&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:outline-offset-2 [&_.recharts-surface:focus-visible]:outline-sea'

export default function ReportsCharts({ records }: { records: Incident[] }) {
  const severity = [
    { label: 'High', value: records.filter((record) => record.severity === 'high').length },
    { label: 'Medium', value: records.filter((record) => record.severity === 'medium').length },
    { label: 'Info', value: records.filter((record) => record.severity === 'info').length },
  ]
  const drones = [...new Set(records.map((record) => record.droneId))].sort().map((id) => ({
    label: id, value: records.filter((record) => record.droneId === id).length,
  }))
  return <section aria-label="Event analytics" className="grid gap-3 md:grid-cols-2">
    {[
      { id: 'report-severity', title: 'Events by severity', data: severity },
      { id: 'report-drone', title: 'Events by drone', data: drones },
    ].map((chart) => <figure key={chart.id} className="min-w-0 rounded border border-line bg-panel p-4" aria-labelledby={chart.id}>
      <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={chart.id} className="text-sm font-semibold">{chart.title}</h2>
        <p className="text-xs text-mute">Current records · Event count</p>
      </figcaption>
      {!records.length ? <p className="flex h-[210px] items-center text-sm text-mute">No recorded events available.</p> : <div className={`h-[210px] ${focus}`}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={chart.data} layout="vertical" accessibilityLayer aria-label={chart.title} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid horizontal={false} stroke="var(--color-line)" strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} tick={tick} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="label" width={76} tick={tick} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: 'var(--color-ink)' }} cursor={{ fill: 'var(--color-shoal)', fillOpacity: 0.3 }} />
            <Bar dataKey="value" name="Events" fill="var(--color-sea)" maxBarSize={20} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>}
      <table className="sr-only"><caption>{chart.title}</caption>
        <thead><tr><th scope="col">Category</th><th scope="col">Events</th></tr></thead>
        <tbody>{chart.data.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.value}</td></tr>)}</tbody>
      </table>
    </figure>)}
  </section>
}
