import { useSurveillanceData } from '../../../lib/useSurveillanceData'
import { useWatchFloorStore } from '../store/useWatchFloorStore'

export function WatchFloorSummary() {
  const { data } = useSurveillanceData()
  const selected = useWatchFloorStore((state) => state.selectedDroneId)
  const telemetry = useWatchFloorStore((state) => state.telemetry[selected])
  const alertCount = useWatchFloorStore((state) => state.alerts.length)
  const metrics = [
    { label: 'Monitored drones', value: data?.drones.length ?? '—', detail: 'On the coastal chart', tone: 'border-l-sea' },
    { label: 'Alerts in queue', value: alertCount, detail: 'Available for incident review', tone: 'border-l-red' },
    { label: 'Selected battery', value: telemetry ? `${telemetry.battery}%` : '—', detail: selected, tone: 'border-l-green' },
    { label: 'Selected altitude', value: telemetry ? `${telemetry.altitude} m` : '—', detail: selected, tone: 'border-l-sea' },
    { label: 'Selected speed', value: telemetry ? `${telemetry.speed.toFixed(1)} m/s` : '—', detail: selected, tone: 'border-l-sea' },
  ]
  return <dl aria-label="Watch floor overview" className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
    {metrics.map((metric) => <div key={metric.label} className={`rounded border border-line border-l-[3px] bg-panel px-4 py-3 ${metric.tone}`}>
      <dt className="text-xs font-medium text-mute">{metric.label}</dt>
      <dd className="mt-2">
        <span className="block text-[26px] font-bold leading-none tracking-tight">{metric.value}</span>
        <span className="mt-2 block text-[11px] text-mute">{metric.detail}</span>
      </dd>
    </div>)}
  </dl>
}
