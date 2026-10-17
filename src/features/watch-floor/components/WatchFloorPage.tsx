import { lazy, Suspense } from 'react'
import { useWatchFloorLiveData } from '../hooks/useWatchFloorLiveData'
import { ChartPanel } from './ChartPanel'
import { LiveFeedPanel } from './LiveFeedPanel'
import { TelemetryStrip } from './TelemetryStrip'
import { AlertQueue } from './AlertQueue'
import { HighAlertToast } from './HighAlertToast'
import { WatchFloorSummary } from './WatchFloorSummary'

const WatchFloorCharts = lazy(() => import('./WatchFloorCharts'))

export function WatchFloorPage() {
  useWatchFloorLiveData()
  return (
    <div className="flex min-h-full flex-col gap-3 p-4 xl:h-full">
      <header className="flex shrink-0 flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-bold tracking-tight">Watch floor</h1>
        <p className="text-xs text-mute">Coastal chart and live monitoring</p>
      </header>
      <WatchFloorSummary />
      <div className="grid min-h-[360px] flex-1 gap-3 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <ChartPanel />
        <aside aria-label="Live monitoring" className="flex min-h-0 flex-col overflow-hidden rounded border border-line bg-panel">
          <LiveFeedPanel />
          <TelemetryStrip />
        </aside>
      </div>
      <Suspense fallback={<p role="status" className="min-h-[216px] shrink-0 rounded border border-line bg-panel p-4 text-sm text-mute">Loading watch floor analytics…</p>}>
        <WatchFloorCharts />
      </Suspense>
      <div className="flex shrink-0 flex-col overflow-hidden rounded border border-line bg-panel">
        <HighAlertToast />
        <AlertQueue />
      </div>
    </div>
  )
}
