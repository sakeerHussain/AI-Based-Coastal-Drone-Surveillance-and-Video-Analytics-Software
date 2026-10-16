import type { StyleSpecification } from 'maplibre-gl'
import type { ChartData } from './types'
import { readChartTokens } from '../../lib/themeTokens'
import { zoneLayers } from './zoneLayers'
import { detectionLayers } from './detectionLayers'

export function chartStyle(data: ChartData): StyleSpecification {
  const { land, coastline, flightTracks, detections, zones } = data
  const tokens = readChartTokens()
  return {
    version: 8,
    sources: {
      land: { type: 'geojson', data: land }, coastline: { type: 'geojson', data: coastline },
      zones: { type: 'geojson', data: zones }, tracks: { type: 'geojson', data: flightTracks },
      detections: { type: 'geojson', data: detections },
    },
    layers: [
      { id: 'sea', type: 'background', paint: { 'background-color': tokens.shoal } },
      { id: 'land', type: 'fill', source: 'land', paint: { 'fill-color': tokens.land } },
      { id: 'coastline', type: 'line', source: 'coastline',
        paint: { 'line-color': tokens.sea, 'line-width': 1.6 } },
      ...zoneLayers(tokens),
      { id: 'flight-track', type: 'line', source: 'tracks',
        paint: { 'line-color': tokens.ink, 'line-width': 1.5, 'line-dasharray': [3, 4] } },
      ...detectionLayers(tokens),
    ],
  }
}
