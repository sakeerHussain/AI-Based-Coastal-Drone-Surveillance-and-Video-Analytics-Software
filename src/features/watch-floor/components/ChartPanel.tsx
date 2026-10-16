import { useState } from 'react'
import type { Map } from 'maplibre-gl'
import { ChartMap, type ChartData } from '../../../components/chart'
import { chartBounds, land, coastline, flightTracks, detections, places } from '../../../mocks/watch-floor/chart'
import { zones, zoneLabels } from '../../../mocks/watch-floor/zones'
import { drones } from '../../../mocks/watch-floor/drones'
import { useWatchFloorMap } from '../hooks/useWatchFloorMap'
import { useWatchFloorStore } from '../store/useWatchFloorStore'
import { ChartControls } from './ChartControls'
import { ChartLegend } from './ChartLegend'

const chartData: ChartData = {
  bounds: chartBounds, land, coastline, flightTracks, detections, places, zones, zoneLabels, drones,
}

export function ChartPanel() {
  const [map, setMap] = useState<Map | null>(null)
  const layers = useWatchFloorStore((state) => state.layers)
  const selectedDroneId = useWatchFloorStore((state) => state.selectedDroneId)
  const alerts = useWatchFloorStore((state) => state.alerts)
  useWatchFloorMap(map)
  return (
    <section aria-label="Coastal chart" className="relative min-h-[420px] border-b border-line bg-shoal xl:border-r xl:border-b-0">
      <ChartMap data={chartData} layers={layers} selectedDroneId={selectedDroneId}
        alerts={alerts} onReady={setMap} />
      <ChartControls />
      <ChartLegend />
    </section>
  )
}
