import type { FeatureCollection, LineString, Polygon, Point } from 'geojson'
import { zones } from './zones'

const coast = [
  [76.15, 10.5],
  [76.174, 10.215], [76.179, 10.195], [76.185, 10.181], [76.183, 10.168],
  [76.181, 10.15], [76.18, 10.137], [76.185, 10.116], [76.194, 10.09],
  [76.204, 10.065], [76.215, 10.04], [76.227, 10.015], [76.239, 9.99],
  [76.241, 9.97], [76.248, 9.95], [76.3, 9.7],
]
const initialPositions = zones.features
  .filter((zone) => zone.properties?.id === 'Z-04' || zone.properties?.id === 'Z-02')
  .flatMap((zone) => zone.geometry.coordinates[0])
export const chartBounds: [[number, number], [number, number]] = [
  [Math.min(...initialPositions.map(([lng]) => lng)), Math.min(...initialPositions.map(([, lat]) => lat))],
  [Math.max(...initialPositions.map(([lng]) => lng)), Math.max(...initialPositions.map(([, lat]) => lat))],
]
export const land: FeatureCollection<Polygon> = {
  type: 'FeatureCollection', features: [{
    type: 'Feature', properties: {}, geometry: {
      type: 'Polygon', coordinates: [[...coast, [77, 9.7], [77, 10.5], coast[0]]],
    },
  }],
}
export const coastline: FeatureCollection<LineString> = {
  type: 'FeatureCollection', features: [{
    type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coast },
  }],
}
export const flightTracks: FeatureCollection<LineString> = {
  type: 'FeatureCollection', features: [{
    type: 'Feature', properties: { droneId: 'KP-D07' }, geometry: {
      type: 'LineString',
      coordinates: [[76.223, 9.98], [76.205, 10.025], [76.18, 10.09],
        [76.164, 10.14], [76.153, 10.17], [76.158, 10.185]],
    },
  }],
}
export const detections: FeatureCollection<Point> = {
  type: 'FeatureCollection', features: [
    { type: 'Feature', properties: { tone: 'amber' }, geometry: { type: 'Point', coordinates: [76.178, 10.139] } },
    { type: 'Feature', properties: { tone: 'amber' }, geometry: { type: 'Point', coordinates: [76.177, 10.137] } },
    { type: 'Feature', properties: { tone: 'green' }, geometry: { type: 'Point', coordinates: [76.14, 10.12] } },
    { type: 'Feature', properties: { tone: 'green' }, geometry: { type: 'Point', coordinates: [76.208, 10.003] } },
  ],
}
export const places = [
  { name: 'Munambam', position: [76.194, 10.179] as [number, number] },
  { name: 'Cherai', position: [76.197, 10.137] as [number, number] },
  { name: 'Fort Kochi', position: [76.261, 9.976] as [number, number] },
]
