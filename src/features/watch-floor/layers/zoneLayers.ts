import type { ExpressionSpecification, LayerSpecification } from 'maplibre-gl'
import type { ChartTokens } from '../../../lib/themeTokens'

export function zoneLayers(tokens: ChartTokens): LayerSpecification[] {
  const colour: ExpressionSpecification = [
    'match', ['get', 'id'], 'Z-04', tokens.red, 'Z-02', tokens.amber, 'Z-07', tokens.sea, tokens.sea,
  ]
  return [
    { id: 'zone-surface', type: 'fill', source: 'zones',
      paint: { 'fill-color': tokens.panel, 'fill-opacity': 1 } },
    { id: 'zone-fill', type: 'fill', source: 'zones',
      paint: { 'fill-color': colour, 'fill-opacity': 0.12 } },
    { id: 'zone-outline', type: 'line', source: 'zones',
      paint: { 'line-color': colour, 'line-width': 1.5, 'line-dasharray': [6, 4] } },
  ]
}
