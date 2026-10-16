import type { SurveillanceData } from '../../lib/surveillanceDataTypes'
import { chartBounds, land, coastline, flightTracks, detections, places } from './chart'
import { zones, zoneLabels } from './zones'
import { drones } from './drones'
import { scenes } from './scenes'

export const surveillanceData: SurveillanceData = {
  chart: { bounds: chartBounds, land, coastline, flightTracks, detections, places, zones, zoneLabels, drones },
  drones, scenes,
}
