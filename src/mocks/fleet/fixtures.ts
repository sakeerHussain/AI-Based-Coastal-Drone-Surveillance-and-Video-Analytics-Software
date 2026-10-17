import type { FleetData, FlightMission } from '../../features/fleet'
import type { ChartPosition } from '../../components/chart'
import { feedFixtures } from '../feed-wall/feeds'
import { drones } from '../watch-floor/drones'
import { surveillanceData } from '../watch-floor/data'
import { flightTracks } from '../watch-floor/chart'
import { appLoadedAt } from '../../lib/time'

function distanceKm(route: ChartPosition[]) {
  const rad = Math.PI / 180
  return route.slice(1).reduce((distance, [lng, lat], index) => {
    const [previousLng, previousLat] = route[index]
    const a = Math.sin((lat - previousLat) * rad / 2) ** 2
      + Math.cos(previousLat * rad) * Math.cos(lat * rad) * Math.sin((lng - previousLng) * rad / 2) ** 2
    return distance + 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }, 0)
}
const missions: FlightMission[] = drones.flatMap((drone, index) => {
  const route: ChartPosition[] = index === 0
    ? flightTracks.features[0].geometry.coordinates.map(([lng, lat]) => [lng, lat])
    : [[drone.position[0] - 0.014, drone.position[1] - 0.018],
      [drone.position[0] - 0.008, drone.position[1] - 0.009], [...drone.position]]
  const completedRoute = [...route].reverse()
  return [
    { id: `mission-${drone.id}-current`, droneId: drone.id, name: `${drone.location} coastal patrol`, status: 'In progress',
      startedAt: appLoadedAt - (28 + index * 3) * 60_000, endedAt: null, route, distanceKm: distanceKm(route) },
    { id: `mission-${drone.id}-previous`, droneId: drone.id, name: `${drone.location} previous patrol`, status: 'Completed',
      startedAt: appLoadedAt - (150 + index * 15) * 60_000, endedAt: appLoadedAt - (110 + index * 15) * 60_000,
      route: completedRoute, distanceKm: distanceKm(completedRoute) },
  ]
})
export const fleetData: FleetData = {
  drones: feedFixtures.map((feed, index) => ({
    id: feed.id, location: feed.title.slice(feed.id.length + 1), telemetry: feed.telemetry, feedIndex: index,
    linkStatus: 'Connected', flightStatus: drones.some((item) => item.id === feed.id) ? 'Monitoring' : 'Not available',
    watchFloor: drones.some((item) => item.id === feed.id),
  })),
  missions, chart: surveillanceData.chart,
}
