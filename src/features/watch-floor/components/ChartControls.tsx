import { drones } from '../../../mocks/watch-floor/drones'
import { useWatchFloorStore } from '../store/useWatchFloorStore'

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'
export function ChartControls() {
  const selected = useWatchFloorStore((state) => state.selectedDroneId)
  const selectDrone = useWatchFloorStore((state) => state.selectDrone)
  const layers = useWatchFloorStore((state) => state.layers)
  const toggleLayer = useWatchFloorStore((state) => state.toggleLayer)
  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-3">
      <div className="pointer-events-auto flex flex-wrap gap-2 text-sm" aria-label="Select drone">
        {drones.map((drone) => (
          <button key={drone.id} type="button" aria-pressed={selected === drone.id}
            onClick={() => selectDrone(drone.id)}
            className={`rounded border border-line px-3 py-1.5 ${focus} ${selected === drone.id ? 'bg-ink text-paper' : 'bg-panel text-ink'}`}>
            {drone.id}
          </button>
        ))}
      </div>
      <fieldset className="pointer-events-auto space-y-1 rounded border border-line bg-panel p-2 text-xs">
        <legend className="sr-only">Chart layers</legend>
        {([['zones', 'Zones'], ['tracks', 'Flight tracks'], ['detections', 'Detections']] as const).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2">
            <input type="checkbox" checked={layers[key]} onChange={() => toggleLayer(key)}
              className={`accent-sea ${focus}`} />
            {label}
          </label>
        ))}
      </fieldset>
    </div>
  )
}
