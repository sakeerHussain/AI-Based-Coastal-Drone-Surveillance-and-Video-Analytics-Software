import type { FeatureCollection, LineString, Point, Polygon } from 'geojson'
import type { Map } from 'maplibre-gl'

export type LayerVisibility = { zones: boolean; tracks: boolean; detections: boolean }
export type ChartPosition = [number, number]
export interface ChartZoneLabel {
  id: string
  name: string
  tone: 'red' | 'amber' | 'sea'
  position: ChartPosition
}
export interface ChartData {
  bounds: [ChartPosition, ChartPosition]
  land: FeatureCollection<Polygon>
  coastline: FeatureCollection<LineString>
  zones: FeatureCollection<Polygon>
  flightTracks: FeatureCollection<LineString>
  detections: FeatureCollection<Point>
  drones: readonly { id: string; position: ChartPosition }[]
  places: readonly { name: string; position: ChartPosition }[]
  zoneLabels: readonly ChartZoneLabel[]
}
export interface ChartMapProps {
  data: ChartData
  layers: LayerVisibility
  selectedDroneId?: string
  alerts: readonly { severity: string; title: string; position: ChartPosition }[]
  onReady?: (map: Map | null) => void
}
