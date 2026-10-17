import { useNavigate } from 'react-router-dom'
import { formatIstTime } from '../../../lib/time'
import { useWatchFloorStore } from '../store/useWatchFloorStore'

const severityStyle = { high: 'border-red', medium: 'border-amber', info: 'border-green' }
const severityLabel = { high: 'High', medium: 'Medium', info: 'Info' }
export function AlertQueue() {
  const navigate = useNavigate()
  const alerts = useWatchFloorStore((state) => state.alerts)
  return (
    <section aria-labelledby="alert-queue-title" className="flex h-[220px] min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2">
          <h2 id="alert-queue-title" className="text-sm font-semibold">Alert queue</h2>
          <span className="rounded bg-paper px-2 py-0.5 text-[11px] font-semibold">{alerts.length}</span>
        </div>
        <p className="text-[11px] text-mute">Select an alert to review its incident</p>
      </div>
      <div aria-hidden="true" className="hidden shrink-0 grid-cols-[minmax(0,1fr)_100px_120px_70px] gap-4 border-b border-line bg-paper py-1.5 pr-4 pl-5 text-[11px] text-mute sm:grid">
        <span>Incident</span><span>Severity</span><span>Drone</span><span className="text-right">Time (IST)</span>
      </div>
      <ul className="min-h-0 flex-1 divide-y divide-line overflow-auto">
        {alerts.map((alert) => (
          <li key={alert.id}>
            <button type="button" onClick={() => navigate(`/incidents/${alert.id}`)} className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-l-4 px-4 py-2.5 text-left hover:bg-shoal/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sea sm:grid-cols-[minmax(0,1fr)_100px_120px_70px] ${severityStyle[alert.severity]}`}>
              <span className="col-span-2 text-xs font-semibold leading-snug sm:col-span-1">{alert.title}</span>
              <span className="text-[11px] text-mute">{severityLabel[alert.severity]}<span className="sr-only"> severity</span></span>
              <span className="text-[11px] text-mute">{alert.droneId}</span>
              <time dateTime={new Date(alert.createdAt).toISOString()} className="text-right text-[11px] text-mute">
                {formatIstTime(alert.createdAt)}
              </time>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
