import { Link } from 'react-router-dom'
import { formatIstTime } from '../../../lib/time'
import { useWatchFloorStore } from '../store/useWatchFloorStore'

const severityStyle = { high: 'border-red', medium: 'border-amber', info: 'border-green' }
const severityLabel = { high: 'High', medium: 'Medium', info: 'Info' }
export function AlertQueue() {
  const alerts = useWatchFloorStore((state) => state.alerts)
  return (
    <section aria-labelledby="alert-queue-title" className="flex min-h-0 flex-1 flex-col">
      <h2 id="alert-queue-title" className="border-b border-line px-4 py-2 text-sm font-semibold">Alert queue</h2>
      <ul className="flex-1 divide-y divide-line overflow-auto">
        {alerts.map((alert) => (
          <li key={alert.id}>
            <Link to="/incidents" className={`flex gap-3 border-l-4 px-4 py-3 text-left hover:bg-shoal focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sea ${severityStyle[alert.severity]}`}>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold leading-snug">{alert.title}</span>
                <span className="mt-0.5 block text-xs text-mute">{severityLabel[alert.severity]} severity, {alert.droneId}</span>
              </span>
              <time dateTime={new Date(alert.createdAt).toISOString()} className="text-xs text-mute">
                {formatIstTime(alert.createdAt)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
