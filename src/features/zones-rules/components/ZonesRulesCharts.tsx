import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { zoneTypes } from '../../../mocks/zones-rules/fixtures'
import { useZonesRulesStore } from '../store/useZonesRulesStore'

const tick = { fill: 'var(--color-mute)', fontSize: 10 }
const tooltipStyle = {
  background: 'var(--color-panel)', border: '1px solid var(--color-line)',
  color: 'var(--color-ink)', borderRadius: 4, fontSize: 12,
}
const focus = '[&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:outline-offset-2 [&_.recharts-surface:focus-visible]:outline-sea'
const cursor = { fill: 'var(--color-shoal)', fillOpacity: 0.3 }

export default function ZonesRulesCharts() {
  const zones = useZonesRulesStore((state) => state.zones)
  const rules = useZonesRulesStore((state) => state.rules)
  const types = zoneTypes.map((type) => ({ label: type, value: zones.filter((zone) => zone.type === type).length }))
  const thresholds = zones.flatMap((zone) => {
    const rule = rules[zone.id]
    if (!rule) return []
    const minutes = Number.parseFloat(rule.threshold)
    return Number.isFinite(minutes) ? [{ id: zone.id, minutes }] : []
  })
  return <section aria-label="Zone and rule analytics" className="grid shrink-0 gap-3 md:grid-cols-2">
    <figure className="min-w-0 rounded border border-line bg-panel p-3" aria-labelledby="zone-type-chart-title">
      <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-1">
        <h2 id="zone-type-chart-title" className="text-sm font-semibold">Zones by type</h2>
        <p className="text-[11px] text-mute">Current zones</p>
      </figcaption>
      <div className={`h-[176px] ${focus}`}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={types} layout="vertical" accessibilityLayer aria-label="Current zone counts by type" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke="var(--color-line)" strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 'dataMax + 1']} allowDecimals={false} tick={tick} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="label" width={124} tick={tick} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: 'var(--color-ink)' }} cursor={cursor} />
            <Bar dataKey="value" name="Zones" fill="var(--color-sea)" maxBarSize={14} radius={[0, 2, 2, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Current zone counts by type</caption>
        <thead><tr><th scope="col">Zone type</th><th scope="col">Zones</th></tr></thead>
        <tbody>{types.map((type) => <tr key={type.label}><th scope="row">{type.label}</th><td>{type.value}</td></tr>)}</tbody>
      </table>
    </figure>
    <figure className="min-w-0 rounded border border-line bg-panel p-3" aria-labelledby="zone-dwell-chart-title">
      <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-1">
        <h2 id="zone-dwell-chart-title" className="text-sm font-semibold">Rule dwell thresholds</h2>
        <p className="text-[11px] text-mute">Saved rules only · Minutes</p>
      </figcaption>
      {!thresholds.length ? <p className="flex h-[176px] items-center text-xs text-mute">No saved dwell thresholds to display.</p> : <>
        <div className={`h-[176px] ${focus}`}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={thresholds} accessibilityLayer aria-label="Saved rule dwell thresholds by zone in minutes" margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="3 3" />
              <XAxis dataKey="id" tick={tick} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis domain={[0, 'auto']} allowDecimals={false} tick={tick} tickFormatter={(value: number) => `${value} min`} axisLine={false} tickLine={false} width={56} />
              <Tooltip formatter={(value) => `${value} min`} contentStyle={tooltipStyle} itemStyle={{ color: 'var(--color-ink)' }} cursor={cursor} />
              <Bar dataKey="minutes" name="Dwell threshold" fill="var(--color-sea)" maxBarSize={32} radius={[2, 2, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <table className="sr-only">
          <caption>Saved rule dwell thresholds in minutes</caption>
          <thead><tr><th scope="col">Zone</th><th scope="col">Dwell threshold</th></tr></thead>
          <tbody>{thresholds.map((threshold) => <tr key={threshold.id}><th scope="row">{threshold.id}</th><td>{threshold.minutes} min</td></tr>)}</tbody>
        </table>
      </>}
    </figure>
  </section>
}
