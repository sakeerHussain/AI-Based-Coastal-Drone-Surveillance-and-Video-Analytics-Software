import type { FeatureCollection, Polygon } from 'geojson'

export const zoneLabels = [
  { id: 'Z-04', name: 'Restricted anchorage', tone: 'red', position: [76.167, 10.184] as [number, number] },
  { id: 'Z-02', name: 'Beach crowd', tone: 'amber', position: [76.166, 10.145] as [number, number] },
  { id: 'Z-07', name: 'Harbour mouth', tone: 'sea', position: [76.215, 9.993] as [number, number] },
] as const
const polygons = [
  [[76.15, 10.184], [76.167, 10.184], [76.167, 10.168], [76.15, 10.168], [76.15, 10.184]],
  [[76.166, 10.145], [76.183, 10.145], [76.183, 10.129], [76.166, 10.129], [76.166, 10.145]],
  [[76.215, 9.993], [76.232, 9.993], [76.232, 9.977], [76.215, 9.977], [76.215, 9.993]],
]
export const zones: FeatureCollection<Polygon> = {
  type: 'FeatureCollection',
  features: zoneLabels.map((zone, index) => ({
    type: 'Feature', properties: { id: zone.id, tone: zone.tone },
    geometry: { type: 'Polygon', coordinates: [polygons[index]] },
  })),
}
