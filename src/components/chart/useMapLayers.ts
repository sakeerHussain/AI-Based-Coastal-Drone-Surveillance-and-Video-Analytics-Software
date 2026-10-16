import { useEffect } from 'react'
import type { Map } from 'maplibre-gl'
import type { LayerVisibility } from './types'

export function useMapLayers(map: Map | null, layers: LayerVisibility) {
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
