import { useLiveDataStore } from '../../../lib/useLiveDataStore'

export function SystemHealthPanel() {
  const health = useLiveDataStore((state) => state.health)
  const bars = health ? [
    { label: `Feeds live (${health.feedsLive} of ${health.feedCapacity})`, value: health.feedsLive / health.feedCapacity * 100, tone: 'bg-sea' },
    { label: 'GPU load', value: health.gpuLoad, tone: 'bg-amber' },
    { label: 'Storage used', value: health.storageUsed, tone: 'bg-sea' },
    { label: 'Alert delivery success', value: health.alertDelivery, tone: 'bg-green' },
  ] : []
  return <aside className="h-fit rounded border border-line bg-panel p-4" aria-labelledby="health-title">
    <h2 id="health-title" className="font-bold">System health</h2>
    {!health ? <p role="status" className="mt-3 text-sm text-mute">Waiting for health data…</p> : <>
      {bars.map(({ label, value, tone }) => <div key={label} className="mt-3">
        <div className="flex justify-between gap-3 text-sm"><span>{label}</span><span className="font-semibold">{Number(value.toFixed(1))}%</span></div>
        <div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Number(value.toFixed(1))}
          className="mt-1 h-2 overflow-hidden rounded bg-shoal">
          <div className={`h-full rounded ${tone}`} style={{ width: `${value}%` }} />
        </div>
      </div>)}
      <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
        <dt className="text-mute">Inference delay</dt><dd className="font-semibold">{health.inferenceDelay} ms</dd>
        <dt className="text-mute">Last backup</dt><dd className="font-semibold">{health.lastBackup}</dd>
        <dt className="text-mute">Uptime, 30 days</dt><dd className="font-semibold">{health.uptime.toFixed(2)}%</dd>
      </dl>
    </>}
  </aside>
}
