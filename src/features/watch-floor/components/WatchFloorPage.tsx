import { useWatchFloorLiveData } from '../hooks/useWatchFloorLiveData'
import { ChartPanel } from './ChartPanel'
import { LiveFeedPanel } from './LiveFeedPanel'
import { TelemetryStrip } from './TelemetryStrip'
import { AlertQueue } from './AlertQueue'
import { HighAlertToast } from './HighAlertToast'

export function WatchFloorPage() {
  useWatchFloorLiveData()
  return (
    <div className="grid min-h-[560px] xl:h-full xl:grid-cols-[minmax(0,1fr)_380px]">
      <ChartPanel />
      <aside aria-label="Live monitoring" className="flex min-h-0 flex-col bg-panel">
        <LiveFeedPanel />
        <TelemetryStrip />
        <HighAlertToast />
        <AlertQueue />
      </aside>
    </div>
  )
}
