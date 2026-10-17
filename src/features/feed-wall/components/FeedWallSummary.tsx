import { useLiveDataStore } from '../../../lib/useLiveDataStore'

interface Props {
  total: number
  capacity: number
  linked: number
}

export function FeedWallSummary({ total, capacity, linked }: Props) {
  const health = useLiveDataStore((state) => state.health)
  const percent = (value: number | undefined) => value === undefined ? '—' : `${Number(value.toFixed(1))}%`
  const metrics = [
    { label: 'Live feeds', value: total, detail: `of ${capacity} feed capacity`, tone: 'border-l-green' },
    { label: 'Feeds with alerts', value: linked, detail: 'with linked incidents', tone: 'border-l-red' },
    { label: 'GPU load', value: percent(health?.gpuLoad), detail: 'Current processing load', tone: 'border-l-amber' },
    { label: 'Storage used', value: percent(health?.storageUsed), detail: 'Current storage usage', tone: 'border-l-sea' },
    { label: 'Alert delivery', value: percent(health?.alertDelivery), detail: 'Successful deliveries', tone: 'border-l-green' },
  ]
  return <dl aria-label="Feed wall overview" className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
    {metrics.map((metric) => <div key={metric.label} className={`rounded border border-line border-l-[3px] bg-panel px-4 py-3 ${metric.tone}`}>
      <dt className="text-xs font-medium text-mute">{metric.label}</dt>
      <dd className="mt-2">
        <span className="block text-[26px] font-bold leading-none tracking-tight">{metric.value}</span>
        <span className="mt-2 block text-[11px] text-mute">{metric.detail}</span>
      </dd>
    </div>)}
  </dl>
}

