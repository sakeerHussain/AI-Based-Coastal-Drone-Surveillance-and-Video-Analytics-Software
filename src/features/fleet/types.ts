import type { ChartData, ChartPosition } from '../../components/chart'
import type { Telemetry } from '../../lib/liveDataTypes'

export interface FleetDrone {
  id: string; location: string; telemetry: Telemetry; feedIndex: number
  linkStatus: 'Connected' | 'Unavailable'
  flightStatus: 'Monitoring' | 'Not available'
  watchFloor: boolean
}
export interface FlightMission {
  id: string; droneId: string; name: string; status: 'In progress' | 'Completed'
  startedAt: number; endedAt: number | null; route: ChartPosition[]; distanceKm: number
}
export interface FleetData { drones: FleetDrone[]; missions: FlightMission[]; chart: ChartData }
