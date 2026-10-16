import { useEffect } from 'react'
import { Marker, type Map } from 'maplibre-gl'
import { drones } from '../../../mocks/watch-floor/drones'
import { places } from '../../../mocks/watch-floor/chart'
import { zoneLabels } from '../../../mocks/watch-floor/zones'
import { useWatchFloorStore } from '../store/useWatchFloorStore'
import { addMapLabels, type MapLabel } from '../layers/mapLabels'

const tones = { red: 'text-red', amber: 'text-amber', sea: 'text-sea' }
export function useMapMarkers(map: Map | null) {
  const selected = useWatchFloorStore((state) => state.selectedDroneId)
  const layers = useWatchFloorStore((state) => state.layers)
  const alerts = useWatchFloorStore((state) => state.alerts)
  useEffect(() => {
    if (!map) return
    map.setLayoutProperty('zone-surface', 'visibility', layers.zones ? 'visible' : 'none')
    const markers: Marker[] = []
    const labels: MapLabel[] = []
    if (layers.zones) {
      for (const zone of zoneLabels) labels.push({
        text: `${zone.id} ${zone.name}`, position: zone.position,
        className: `text-[10px] font-semibold ${tones[zone.tone]}`,
        priority: 0, anchor: 'bottom-left', offset: [0, -5],
      })
    }
    for (const drone of drones) {
      const dot = document.createElement('span')
      dot.className = `h-2 w-2 rounded-full ${selected === drone.id ? 'bg-ink' : 'bg-sea'}`
      markers.push(new Marker({ element: dot }).setLngLat(drone.position).addTo(map))
      labels.push({
        text: drone.id, position: drone.position,
        className: `text-[11px] font-bold ${selected === drone.id ? 'text-ink' : 'text-sea'}`,
        priority: selected === drone.id ? 1 : 2, anchor: 'left', offset: [8, 0],
      })
    }
    for (const place of places) labels.push({
      text: place.name, position: place.position, className: 'text-xs italic text-mute',
      priority: 3, anchor: 'left', offset: [0, 0],
    })
    const removeLabels = addMapLabels(map, labels)
    if (layers.detections) {
      for (const alert of alerts.filter((item) => item.severity === 'high')) {
        const element = document.createElement('div')
        element.className = 'relative h-3 w-3'
        element.setAttribute('aria-label', alert.title)
        const ring = document.createElement('span')
        ring.className = 'absolute inset-0 rounded-full border-2 border-red motion-safe:animate-ping'
        const dot = document.createElement('span')
        dot.className = 'absolute inset-0 rounded-full bg-red'
        element.append(ring, dot)
        markers.push(new Marker({ element }).setLngLat(alert.position).addTo(map))
      }
    }
    return () => { removeLabels(); markers.forEach((marker) => marker.remove()) }
  }, [map, selected, layers.zones, layers.detections, alerts])
}
