import { useEffect, useRef, useState } from 'react'
import type { FeatureCollection, Geometry } from 'geojson'
import type { GeoJSONSource, Map, MapMouseEvent } from 'maplibre-gl'
import { readChartTokens } from '../../../lib/themeTokens'
import type { ChartPosition } from '../../../components/chart'

export function useZoneDrawing(map: Map | null) {
  const [drawing, setDrawing] = useState(false)
  const [points, setPoints] = useState<ChartPosition[]>([])
  const [pending, setPending] = useState<ChartPosition[] | null>(null)
  const [error, setError] = useState('')
  const current = useRef<ChartPosition[]>([])
  function update(next: ChartPosition[]) { current.current = next; setPoints(next); setError('') }
  function finish() {
    const vertices = current.current
    const area = vertices.reduce((sum, [x, y], index) => {
      const [nx, ny] = vertices[(index + 1) % vertices.length]
      return sum + x * ny - nx * y
    }, 0)
    if (vertices.length < 3 || Math.abs(area) < 1e-10) {
      setError('Add at least three points that enclose an area.'); return
    }
    setPending([...vertices]); setDrawing(false); update([])
  }
  const finishRef = useRef(finish)
  useEffect(() => { finishRef.current = finish })
  useEffect(() => {
    if (!map || !drawing) return
    const tokens = readChartTokens()
    map.addSource('drawing', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
    map.addLayer({ id: 'drawing-line', type: 'line', source: 'drawing', filter: ['==', '$type', 'LineString'],
      paint: { 'line-color': tokens.sea, 'line-width': 2, 'line-dasharray': [3, 2] } })
    map.addLayer({ id: 'drawing-points', type: 'circle', source: 'drawing', filter: ['==', '$type', 'Point'],
      paint: { 'circle-color': tokens.panel, 'circle-radius': 4, 'circle-stroke-color': tokens.sea, 'circle-stroke-width': 2 } })
    const zoomEnabled = map.doubleClickZoom.isEnabled()
    map.doubleClickZoom.disable()
    map.getCanvas().style.cursor = 'crosshair'
    function click(event: MapMouseEvent) {
      if (event.originalEvent.detail > 1) return
      const point: ChartPosition = [event.lngLat.lng, event.lngLat.lat]
      const last = current.current.at(-1)
      if (last && map!.project(last).dist(map!.project(point)) < 2) return
      update([...current.current, point])
    }
    function complete(event: MapMouseEvent) { event.preventDefault(); finishRef.current() }
    function keyboard(event: KeyboardEvent) {
      if (event.key === 'Escape') { setDrawing(false); update([]) }
      if (event.key === 'Enter') { event.preventDefault(); finishRef.current() }
      if (event.key === ' ') {
        event.preventDefault()
        const center = map!.getCenter()
        update([...current.current, [center.lng, center.lat]])
      }
    }
    map.on('click', click); map.on('dblclick', complete)
    map.getCanvas().addEventListener('keydown', keyboard)
    map.getCanvas().focus({ preventScroll: true })
    return () => {
      map.off('click', click); map.off('dblclick', complete)
      map.getCanvas().removeEventListener('keydown', keyboard)
      if (zoomEnabled) map.doubleClickZoom.enable()
      map.getCanvas().style.cursor = ''
      map.removeLayer('drawing-points'); map.removeLayer('drawing-line'); map.removeSource('drawing')
    }
  }, [map, drawing])
  useEffect(() => {
    if (!map || !drawing) return
    const data: FeatureCollection<Geometry> = { type: 'FeatureCollection', features: points.map((point) => ({
      type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: point },
    })) }
    if (points.length > 1) data.features.push({ type: 'Feature', properties: {},
      geometry: { type: 'LineString', coordinates: points } })
    ;(map.getSource('drawing') as GeoJSONSource).setData(data)
  }, [map, drawing, points])
  return {
    drawing, points, pending, error, finish,
    start: () => { update([]); setDrawing(true) },
    cancel: () => { update([]); setDrawing(false) },
    undo: () => update(current.current.slice(0, -1)),
    closeDialog: () => setPending(null),
  }
}
