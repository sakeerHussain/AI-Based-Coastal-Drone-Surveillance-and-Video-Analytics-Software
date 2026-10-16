import { useEffect } from 'react'
import type { GeoJSONSource } from 'maplibre-gl'
import { useChartMap } from './useChartMap'
import { useMapLayers } from './useMapLayers'
import { useMapMarkers } from './useMapMarkers'
import type { ChartMapProps } from './types'

export function ChartMap({ data, layers, selectedDroneId, alerts, onReady }: ChartMapProps) {
  const { container, map, error } = useChartMap(data)
  useMapLayers(map, layers)
  useMapMarkers(map, data, selectedDroneId, layers, alerts)
  useEffect(() => {
    if (map) (map.getSource('zones') as GeoJSONSource).setData(data.zones)
  }, [map, data.zones])
  useEffect(() => {
    if (!map) return
    onReady?.(map)
    return () => onReady?.(null)
  }, [map, onReady])
  return <>
    <div ref={container} className="inset-0" style={{ position: 'absolute' }} />
    {error && <p role="alert" className="absolute inset-x-3 top-32 rounded bg-panel p-3 text-sm">
      The chart could not load. Reload to retry; WebGL support is required.
    </p>}
  </>
}
