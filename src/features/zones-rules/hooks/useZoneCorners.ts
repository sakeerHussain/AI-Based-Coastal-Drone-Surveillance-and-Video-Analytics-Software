import { useEffect, useRef } from 'react'
import { Marker, type GeoJSONSource, type Map } from 'maplibre-gl'
import type { FeatureCollection, Polygon } from 'geojson'
import type { ChartPosition } from '../../../components/chart'
import { useZonesRulesStore } from '../store/useZonesRulesStore'
import type { Zone } from '../types'

export function zoneFeatures(zones: Zone[]): FeatureCollection<Polygon> {
  return { type: 'FeatureCollection', features: zones.map((zone) => ({
    type: 'Feature', properties: { id: zone.id, tone: zone.tone },
    geometry: { type: 'Polygon', coordinates: [[...zone.points, zone.points[0]]] },
  })) }
}
export function useZoneCorners(map: Map | null, zone: Zone, enabled: boolean) {
  const reshape = useZonesRulesStore((state) => state.reshape)
  const focusedCorner = useRef<string | null>(null)
  useEffect(() => {
    if (!map || !enabled) return
    const focused = focusedCorner.current
    focusedCorner.current = null
    const markers = zone.points.map((position, index) => {
      const element = document.createElement('button')
      element.type = 'button'
      element.setAttribute('aria-label', `Corner ${index + 1} of ${zone.id}. Drag or use arrow keys to reshape.`)
      element.setAttribute('data-corner', `${zone.id}-${index}`)
      element.className = 'h-3 w-3 border-2 border-sea bg-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'
      const marker = new Marker({ element, draggable: true }).setLngLat(position).addTo(map)
      function update(commit: boolean) {
        const location = marker.getLngLat()
        const points = zone.points.map((point, corner): ChartPosition => corner === index ? [location.lng, location.lat] : point)
        const zones = useZonesRulesStore.getState().zones.map((item) => item.id === zone.id ? { ...zone, points } : item)
        ;(map!.getSource('zones') as GeoJSONSource).setData(zoneFeatures(zones))
        if (commit) reshape(zone.id, points)
      }
      marker.on('drag', () => update(false))
      marker.on('dragend', () => update(true))
      element.addEventListener('keydown', (event) => {
        const direction: Record<string, [number, number]> = {
          ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
        }
        if (!direction[event.key]) return
        event.preventDefault()
        event.stopPropagation()
        const point = map.project(marker.getLngLat())
        const [x, y] = direction[event.key]
        const step = event.shiftKey ? 10 : 2
        marker.setLngLat(map.unproject([point.x + x * step, point.y + y * step]))
        update(true)
      })
      if (focused === `${zone.id}-${index}`) element.focus({ preventScroll: true })
      return marker
    })
    return () => {
      focusedCorner.current = document.activeElement?.getAttribute('data-corner') ?? null
      markers.forEach((marker) => marker.remove())
    }
  }, [map, zone, enabled, reshape])
}
