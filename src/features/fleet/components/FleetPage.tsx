import { useSearchParams } from 'react-router-dom'
import { useLiveData } from '../../../hooks/useLiveData'
import { useLiveDataStore } from '../../../lib/useLiveDataStore'
import { useFleetData } from '../api/fleet'
import { DroneDirectory } from './DroneDirectory'
import { FlightHistory } from './FlightHistory'
import { MissionDetails } from './MissionDetails'

export function FleetPage() {
  const query = useFleetData()
  const telemetry = useLiveDataStore((state) => state.telemetry)
  const [params, setParams] = useSearchParams()
  useLiveData()
  if (query.isPending) return <p role="status" className="p-4 text-sm text-mute">Loading drone fleet…</p>
  if (query.isError) return <div role="alert" className="p-4 text-sm">Could not load fleet data.
    <button type="button" onClick={() => void query.refetch()} className="ml-3 rounded border border-line bg-panel px-3 py-2 focus-visible:outline-2 focus-visible:outline-sea">Try again</button></div>
  const drones = query.data.drones.map((drone) => ({ ...drone, telemetry: telemetry[drone.id] ?? drone.telemetry }))
  const selected = drones.find((drone) => drone.id === params.get('drone')) ?? drones[0]
  const missions = query.data.missions.filter((mission) => mission.droneId === selected?.id).sort((a, b) => b.startedAt - a.startedAt)
  const mission = missions.find((item) => item.id === params.get('mission')) ?? missions[0]
  return <div className="flex min-h-full flex-col gap-3 p-4">
    <header className="flex flex-wrap items-baseline justify-between gap-2">
      <h1 className="text-xl font-bold tracking-tight">Drone fleet and missions</h1>
      <p className="text-xs text-mute">Read-only demo fleet and flight history</p>
    </header>
    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Fleet overview">
      {[
        ['Fleet drones', drones.length, 'Existing demo drone IDs'],
        ['Connected links', drones.filter((drone) => drone.linkStatus === 'Connected').length, 'Simulated link status'],
        ['Active missions', query.data.missions.filter((item) => item.status === 'In progress').length, 'Demo missions in progress'],
        ['Completed flights', query.data.missions.filter((item) => item.status === 'Completed').length, 'Recorded demo missions'],
      ].map(([label, value, detail]) => <div key={label} className="border border-l-2 border-line border-l-sea bg-panel p-4">
        <dt className="text-xs text-mute">{label}</dt><dd className="mt-2 text-3xl font-bold">{value}</dd><dd className="mt-1 text-xs text-mute">{detail}</dd>
      </div>)}
    </dl>
    <DroneDirectory drones={drones} selectedId={selected?.id ?? ''} onSelect={(id) => setParams({ drone: id }, { replace: true })} />
    {selected && <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <FlightHistory key={selected.id} droneId={selected.id} missions={missions} selectedId={mission?.id} onSelect={(id) => setParams({ drone: selected.id, mission: id }, { replace: true })} />
      <MissionDetails drone={selected} mission={mission} chart={query.data.chart} />
    </div>}
    {!selected && <p className="rounded border border-line bg-panel p-4 text-sm text-mute">No drones are available in this demo.</p>}
  </div>
}
