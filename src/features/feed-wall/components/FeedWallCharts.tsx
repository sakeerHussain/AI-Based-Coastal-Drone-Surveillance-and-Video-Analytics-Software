import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useLiveDataStore } from '../../../lib/useLiveDataStore'
import type { Feed } from '../types'

const tick = { fill: 'var(--color-mute)', fontSize: 10 }
const tooltipStyle = {
  background: 'var(--color-panel)', border: '1px solid var(--color-line)',
  color: 'var(--color-ink)', borderRadius: 4, fontSize: 12,
}
const focus = '[&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:outline-offset-2 [&_.recharts-surface:focus-visible]:outline-sea'
const percent = (value: number) => `${Number(value.toFixed(1))}%`

export default function FeedWallCharts({ feeds }: { feeds: Feed[] }) {
  const telemetry = useLiveDataStore((state) => state.telemetry)
  const health = useLiveDataStore((state) => state.health)
  const batteries = feeds.map((feed) => ({ id: feed.id, value: (telemetry[feed.id] ?? feed.telemetry).battery }))
  const metrics = health ? [
    { label: 'GPU load', value: health.gpuLoad },
    { label: 'Storage used', value: health.storageUsed },
    { label: 'Alert delivery', value: health.alertDelivery },
  ] : []
  return <section aria-label="Feed analytics" className="grid shrink-0 gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
    <figure className="min-w-0 rounded border border-line bg-panel p-3" aria-labelledby="feed-battery-title">
      <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-1">
        <h2 id="feed-battery-title" className="text-sm font-semibold">Drone battery levels</h2>
        <p className="text-[11px] text-mute">Current snapshot · All {feeds.length} live feeds</p>
      </figcaption>
      <div tabIndex={0} aria-label="Battery chart. Scroll horizontally if needed."
        className={`overflow-x-auto rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea ${focus}`}>
        <div className="h-[160px] min-w-[640px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={batteries} accessibilityLayer margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="3 3" />
              <XAxis dataKey="id" tick={tick} axisLine={false} tickLine={false} interval={0} angle={-35} textAnchor="end" height={42} />
              <YAxis domain={[0, 100]} ticks={[0, 50, 100]} tick={tick} tickFormatter={percent} axisLine={false} tickLine={false} width={48} />
              <Tooltip formatter={(value) => `${value}%`} contentStyle={tooltipStyle} itemStyle={{ color: 'var(--color-ink)' }} cursor={{ fill: 'var(--color-shoal)', fillOpacity: 0.3 }} />
              <Bar dataKey="value" name="Battery" fill="var(--color-sea)" maxBarSize={18} radius={[2, 2, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <table className="sr-only">
        <caption>Current battery levels for every live feed</caption>
        <thead><tr><th scope="col">Drone</th><th scope="col">Battery</th></tr></thead>
        <tbody>{batteries.map((feed) => <tr key={feed.id}><th scope="row">{feed.id}</th><td>{percent(feed.value)}</td></tr>)}</tbody>
      </table>
    </figure>
    <figure className="min-w-0 rounded border border-line bg-panel p-3" aria-labelledby="feed-health-chart-title">
      <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-1">
        <h2 id="feed-health-chart-title" className="text-sm font-semibold">System health</h2>
        <p className="text-[11px] text-mute">Current snapshot</p>
      </figcaption>
      {!health ? <p role="status" className="flex h-[160px] items-center text-xs text-mute">Waiting for health data…</p> : <>
        <div className={`h-[160px] ${focus}`}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={metrics} layout="vertical" accessibilityLayer margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="var(--color-line)" strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} ticks={[0, 50, 100]} tick={tick} tickFormatter={percent} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="label" width={88} tick={tick} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => `${value}%`} contentStyle={tooltipStyle} itemStyle={{ color: 'var(--color-ink)' }} cursor={{ fill: 'var(--color-shoal)', fillOpacity: 0.3 }} />
              <Bar dataKey="value" name="Current value" fill="var(--color-green)" maxBarSize={12} radius={[0, 2, 2, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <table className="sr-only">
          <caption>Current system health percentages</caption>
          <thead><tr><th scope="col">Metric</th><th scope="col">Percentage</th></tr></thead>
          <tbody>{metrics.map((metric) => <tr key={metric.label}><th scope="row">{metric.label}</th><td>{percent(metric.value)}</td></tr>)}</tbody>
        </table>
      </>}
    </figure>
  </section>
}
