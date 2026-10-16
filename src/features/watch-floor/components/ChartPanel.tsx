import { useWatchFloorMap } from '../hooks/useWatchFloorMap'
import { useMapLayers } from '../hooks/useMapLayers'
import { useMapMarkers } from '../hooks/useMapMarkers'
import { ChartControls } from './ChartControls'
import { ChartLegend } from './ChartLegend'

export function ChartPanel() {
  const { container, map, error } = useWatchFloorMap()
  useMapLayers(map)
  useMapMarkers(map)
  return (
    <section aria-label="Coastal chart" className="relative min-h-[420px] border-b border-line bg-shoal xl:border-r xl:border-b-0">
      <div ref={container} className="inset-0" style={{ position: 'absolute' }} />
      {error && <p role="alert" className="absolute inset-x-3 top-32 rounded bg-panel p-3 text-sm">
        The chart could not load. Reload to retry; WebGL support is required.
      </p>}
      <ChartControls />
      <ChartLegend />
    </section>
  )
}
