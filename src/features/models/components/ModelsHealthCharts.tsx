import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useLiveDataStore } from '../../../lib/useLiveDataStore'
import { useModelsStore } from '../store/useModelsStore'

const tick = { fill: 'var(--color-mute)', fontSize: 10 }
const tooltipStyle = {
  background: 'var(--color-panel)', border: '1px solid var(--color-line)',
  color: 'var(--color-ink)', borderRadius: 4, fontSize: 12,
}
const focus = '[&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:outline-offset-2 [&_.recharts-surface:focus-visible]:outline-sea'
const cursor = { fill: 'var(--color-shoal)', fillOpacity: 0.3 }
const percent = (value: number) => `${Number(value.toFixed(1))}%`

export default function ModelsHealthCharts() {
  const models = useModelsStore((state) => state.models)
  const loaded = useModelsStore((state) => state.loaded)
  const health = useLiveDataStore((state) => state.health)
  const scores = models.map((model) => ({ id: model.id, label: `${model.name} ${model.version}`, value: model.f1 }))
  const metrics = health ? [
    { label: 'Feeds live', value: health.feedCapacity ? health.feedsLive / health.feedCapacity * 100 : null },
    { label: 'GPU load', value: health.gpuLoad },
    { label: 'Storage used', value: health.storageUsed },
    { label: 'Alert delivery', value: health.alertDelivery },
  ] : []
  return <section aria-label="Model and health analytics" className="grid shrink-0 gap-3 md:grid-cols-2">
    <figure className="min-w-0 rounded border border-line bg-panel p-3" aria-labelledby="model-f1-title">
      <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-1">
        <h2 id="model-f1-title" className="text-sm font-semibold">Registry model F1 scores</h2>
        <p className="text-[11px] text-mute">Current registry · F1, 0–1</p>
      </figcaption>
      {!scores.length ? <p role="status" className="flex h-[176px] items-center text-xs text-mute">
        {loaded ? 'No registered models.' : 'Waiting for the model registry…'}
      </p> : <>
        <div className={`h-[176px] ${focus}`}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={scores} layout="vertical" accessibilityLayer aria-label="Current registry model F1 scores from zero to one" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="var(--color-line)" strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 1]} ticks={[0, 0.5, 1]} tick={tick} tickFormatter={(value: number) => value.toFixed(2)} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="label" width={156} tick={tick} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(2) : String(value)} contentStyle={tooltipStyle} itemStyle={{ color: 'var(--color-ink)' }} cursor={cursor} />
              <Bar dataKey="value" name="F1 score" fill="var(--color-sea)" maxBarSize={14} radius={[0, 2, 2, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <table className="sr-only">
          <caption>Current F1 scores for registered model versions</caption>
          <thead><tr><th scope="col">Model version</th><th scope="col">F1 score</th></tr></thead>
          <tbody>{scores.map((model) => <tr key={model.id}><th scope="row">{model.label}</th><td>{model.value.toFixed(2)}</td></tr>)}</tbody>
        </table>
      </>}
    </figure>
    <figure className="min-w-0 rounded border border-line bg-panel p-3" aria-labelledby="model-health-chart-title">
      <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-1">
        <h2 id="model-health-chart-title" className="text-sm font-semibold">Health snapshot</h2>
        <p className="text-[11px] text-mute">Current system percentages</p>
      </figcaption>
      {!health ? <p role="status" className="flex h-[176px] items-center text-xs text-mute">Waiting for health data…</p> : <>
        <div className={`h-[176px] ${focus}`}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={metrics} layout="vertical" accessibilityLayer aria-label="Current system health percentages" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="var(--color-line)" strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} ticks={[0, 50, 100]} tick={tick} tickFormatter={percent} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="label" width={88} tick={tick} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => typeof value === 'number' ? percent(value) : 'Unavailable'} contentStyle={tooltipStyle} itemStyle={{ color: 'var(--color-ink)' }} cursor={cursor} />
              <Bar dataKey="value" name="Current value" fill="var(--color-green)" maxBarSize={12} radius={[0, 2, 2, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <table className="sr-only">
          <caption>Current system health percentages</caption>
          <thead><tr><th scope="col">Metric</th><th scope="col">Percentage</th></tr></thead>
          <tbody>{metrics.map((metric) => <tr key={metric.label}><th scope="row">{metric.label}</th><td>{metric.value === null ? 'Unavailable' : percent(metric.value)}</td></tr>)}</tbody>
        </table>
      </>}
    </figure>
  </section>
}
