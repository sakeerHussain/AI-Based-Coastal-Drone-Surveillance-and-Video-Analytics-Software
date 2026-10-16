import { useEffect } from 'react'
import type { Map } from 'maplibre-gl'
import { useWatchFloorStore } from '../store/useWatchFloorStore'

export function useMapLayers(map: Map | null) {
  const layers = useWatchFloorStore((state) => state.layers)
  useEffect(() => {
    if (!map) return
    for (const [id, visible] of [
      ['zone-fill', layers.zones], ['zone-outline', layers.zones],
      ['flight-track', layers.tracks], ['detections', layers.detections],
    ] as const) {
      map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none')
    }
  }, [map, layers])
}
