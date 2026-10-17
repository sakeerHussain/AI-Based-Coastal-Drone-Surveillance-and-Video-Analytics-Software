import { useState } from 'react'
import type { Map } from 'maplibre-gl'
import { ChartMap } from '../../../components/chart'
import { useSurveillanceData } from '../../../lib/useSurveillanceData'
import { useWatchFloorMap } from '../hooks/useWatchFloorMap'
import { useWatchFloorStore } from '../store/useWatchFloorStore'
import { ChartControls } from './ChartControls'
import { ChartLegend } from './ChartLegend'

export function ChartPanel() {
  const query = useSurveillanceData()
  const [map, setMap] = useState<Map | null>(null)
  const layers = useWatchFloorStore((state) => state.layers)
  const selectedDroneId = useWatchFloorStore((state) => state.selectedDroneId)
  const alerts = useWatchFloorStore((state) => state.alerts)
  useWatchFloorMap(map, query.data?.drones)
  return (
    <section aria-label="Coastal chart" className="flex min-h-[360px] min-w-0 flex-col overflow-hidden rounded border border-line bg-panel">
      <ChartControls />
      <div className="relative min-h-[280px] flex-1 bg-shoal">
      {query.data && <ChartMap data={query.data.chart} layers={layers} selectedDroneId={selectedDroneId}
        alerts={alerts} onReady={setMap} />}
      {!query.data && <p role={query.isError ? 'alert' : 'status'} className="p-4 text-sm">
        {query.isError ? 'Could not load the chart.' : 'Loading chart…'}
        {query.isError && <button type="button" onClick={() => void query.refetch()}
          className="ml-3 underline focus-visible:outline-2 focus-visible:outline-sea">Try again</button>}
      </p>}
      <ChartLegend />
      </div>
    </section>
  )
}
