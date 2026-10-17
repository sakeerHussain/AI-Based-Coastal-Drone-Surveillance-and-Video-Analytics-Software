import { Link } from 'react-router-dom'
import { ChartMap, type ChartData, type ChartPosition } from '../../../components/chart'
import { useWatchFloorStore } from '../../watch-floor'
import { useFeedWallStore } from '../../feed-wall'
import { formatIstTime } from '../../../lib/time'
import type { FleetDrone, FlightMission } from '../types'

export function MissionDetails({ drone, mission, chart }: { drone: FleetDrone; mission?: FlightMission; chart: ChartData }) {
  const route = mission?.route ?? []
  const bounds: [ChartPosition, ChartPosition] | null = route.length ? [
    [Math.min(...route.map(([lng]) => lng)) - 0.008, Math.min(...route.map(([, lat]) => lat)) - 0.008],
    [Math.max(...route.map(([lng]) => lng)) + 0.008, Math.max(...route.map(([, lat]) => lat)) + 0.008],
  ] : null
  const data: ChartData | null = mission && bounds ? {
    ...chart, bounds, drones: [{ id: drone.id, position: route.at(-1)! }],
    flightTracks: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: { droneId: drone.id }, geometry: { type: 'LineString', coordinates: route } }] },
    detections: { type: 'FeatureCollection', features: [] },
  } : null
  return <section aria-labelledby="mission-details-title" className="min-w-0 rounded border border-line bg-panel p-4">
    <h2 id="mission-details-title" className="text-base font-semibold">{drone.id} · {drone.location}</h2>
    <p className="mt-1 text-xs text-mute">Current demo telemetry</p>
    <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
      {[
        ['Altitude', `${drone.telemetry.altitude} m`], ['Heading', `${drone.telemetry.heading}°`],
        ['Speed', `${drone.telemetry.speed} m/s`], ['Battery', `${drone.telemetry.battery}%`],
      ].map(([label, value]) => <div key={label} className="border-l-2 border-line pl-3"><dt className="text-xs text-mute">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}
    </dl>
    <div className="my-4 flex flex-wrap gap-3 text-sm text-sea">
      {drone.watchFloor && <Link to="/watch-floor" onClick={() => useWatchFloorStore.getState().selectDrone(drone.id)} className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-sea">Open Watch floor</Link>}
      <Link to="/feed-wall" onClick={() => { useFeedWallStore.getState().setLayout(3); useFeedWallStore.getState().setPage(Math.floor(drone.feedIndex / 9)) }} className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-sea">View feed</Link>
      <Link to={`/archive?drone=${encodeURIComponent(drone.id)}`} className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-sea">View recordings</Link>
    </div>
    {mission && data ? <>
      <h3 className="border-t border-line pt-4 text-sm font-semibold">Selected mission · {mission.name}</h3>
      <dl className="my-3 grid gap-3 text-sm sm:grid-cols-2">
        {[
          ['Mission ID', mission.id], ['Status', mission.status], ['Started (IST)', formatIstTime(mission.startedAt, true)],
          ['Ended (IST)', mission.endedAt ? formatIstTime(mission.endedAt, true) : 'In progress'],
          ['Recorded distance', `${mission.distanceKm.toFixed(2)} km`],
          ['Track end (GPS)', `${route.at(-1)![1].toFixed(5)}° N, ${route.at(-1)![0].toFixed(5)}° E`],
        ].map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-xs text-mute">{label}</dt><dd className="mt-1 break-words">{value}</dd></div>)}
      </dl>
      <div aria-label={`Recorded demo route for ${mission.name}`} className="relative h-[300px] overflow-hidden rounded border border-line bg-shoal">
        <ChartMap key={mission.id} data={data} layers={{ zones: true, tracks: true, detections: false }} selectedDroneId={drone.id} alerts={[]} />
      </div>
      <p className="mt-2 text-xs text-mute">Recorded demo track · Arrow keys pan the chart; plus and minus zoom.</p>
    </> : <p className="border-t border-line py-6 text-sm text-mute">Select a drone with demo mission history to view a recorded route.</p>}
  </section>
}
