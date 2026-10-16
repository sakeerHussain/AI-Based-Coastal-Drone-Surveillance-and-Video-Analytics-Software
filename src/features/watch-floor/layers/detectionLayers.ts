import type { LayerSpecification } from 'maplibre-gl'
import type { ChartTokens } from '../../../lib/themeTokens'

export function detectionLayers(tokens: ChartTokens): LayerSpecification[] {
  return [{
    id: 'detections', type: 'circle', source: 'detections',
    paint: { 'circle-radius': 4, 'circle-color': ['match', ['get', 'tone'], 'amber', tokens.amber, tokens.green] },
  }]
}
