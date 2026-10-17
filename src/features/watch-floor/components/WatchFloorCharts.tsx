import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useSurveillanceData } from '../../../lib/useSurveillanceData'
import { useWatchFloorStore } from '../store/useWatchFloorStore'

const tick = { fill: 'var(--color-mute)', fontSize: 10 }
const tooltipStyle = {
  background: 'var(--color-panel)', border: '1px solid var(--color-line)',
  color: 'var(--color-ink)', borderRadius: 4, fontSize: 12,
}
const focus = '[&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:outline-offset-2 [&_.recharts-surface:focus-visible]:outline-sea'
const cursor = { fill: 'var(--color-shoal)', fillOpacity: 0.3 }
const percent = (value: number) => `${value}%`

export default function WatchFloorCharts() {
  const { data, isError } = useSurveillanceData()
  const telemetry = useWatchFloorStore((state) => state.telemetry)
  const alerts = useWatchFloorStore((state) => state.alerts)
  const batteries = (data?.drones ?? []).flatMap((drone) => {
    const value = telemetry[drone.id]
    return value ? [{ id: drone.id, value: value.battery }] : []
  })
  const severities = ([['high', 'High'], ['medium', 'Medium'], ['info', 'Info']] as const).map(([severity, label]) => ({
    label, value: alerts.filter((alert) => alert.severity === severity).length,
  }))
  return <section aria-label="Watch floor analytics" className="grid shrink-0 gap-3 md:grid-cols-2">
    <figure className="min-w-0 rounded border border-line bg-panel p-3" aria-labelledby="watch-battery-title">
      <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-1">
        <h2 id="watch-battery-title" className="text-sm font-semibold">Monitored drone batteries</h2>
        <p className="text-[11px] text-mute">Current snapshot</p>
      </figcaption>
      {!batteries.length ? <p role={isError ? 'alert' : 'status'} className="flex h-[160px] items-center text-xs text-mute">
        {isError ? 'Drone data could not be loaded. Use the chart retry control.' : 'Waiting for monitored drone telemetry…'}
      </p> : <>
        <div className={`h-[160px] ${focus}`}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={batteries} accessibilityLayer aria-label="Current battery percentages by monitored drone" margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="3 3" />
              <XAxis dataKey="id" tick={tick} axisLine={false} tickLine={false} interval={0} />
              <YAxis domain={[0, 100]} ticks={[0, 50, 100]} tick={tick} tickFormatter={percent} axisLine={false} tickLine={false} width={48} />
              <Tooltip formatter={(value) => `${value}%`} contentStyle={tooltipStyle} itemStyle={{ color: 'var(--color-ink)' }} cursor={cursor} />
              <Bar dataKey="value" name="Battery" fill="var(--color-sea)" maxBarSize={32} radius={[2, 2, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <table className="sr-only">
          <caption>Current battery levels for drones on the watch floor chart</caption>
          <thead><tr><th scope="col">Drone</th><th scope="col">Battery</th></tr></thead>
          <tbody>{batteries.map((drone) => <tr key={drone.id}><th scope="row">{drone.id}</th><td>{percent(drone.value)}</td></tr>)}</tbody>
        </table>
      </>}
    </figure>
    <figure className="min-w-0 rounded border border-line bg-panel p-3" aria-labelledby="watch-severity-title">
      <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-1">
        <h2 id="watch-severity-title" className="text-sm font-semibold">Alerts by severity</h2>
        <p className="text-[11px] text-mute">Current queue · {alerts.length} {alerts.length === 1 ? 'alert' : 'alerts'}</p>
      </figcaption>
      <div className={`h-[160px] ${focus}`}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={severities} layout="vertical" accessibilityLayer aria-label="Current queue alert counts by severity" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke="var(--color-line)" strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 'dataMax + 1']} allowDecimals={false} tick={tick} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="label" width={56} tick={tick} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: 'var(--color-ink)' }} cursor={cursor} />
            <Bar dataKey="value" name="Alerts" fill="var(--color-sea)" maxBarSize={12} radius={[0, 2, 2, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Alert counts by severity in the current queue</caption>
        <thead><tr><th scope="col">Severity</th><th scope="col">Alerts</th></tr></thead>
        <tbody>{severities.map((severity) => <tr key={severity.label}><th scope="row">{severity.label}</th><td>{severity.value}</td></tr>)}</tbody>
      </table>
    </figure>
  </section>
}
