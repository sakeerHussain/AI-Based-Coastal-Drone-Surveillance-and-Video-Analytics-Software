import { useSurveillanceData } from '../../../lib/useSurveillanceData'
import { useWatchFloorStore } from '../store/useWatchFloorStore'

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'
export function ChartControls() {
  const { data } = useSurveillanceData()
  const selected = useWatchFloorStore((state) => state.selectedDroneId)
  const selectDrone = useWatchFloorStore((state) => state.selectDrone)
  const layers = useWatchFloorStore((state) => state.layers)
  const toggleLayer = useWatchFloorStore((state) => state.toggleLayer)
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-line p-2">
      <div className="flex flex-wrap gap-1 rounded bg-paper p-1 text-xs" aria-label="Select drone">
        {data?.drones.map((drone) => (
          <button key={drone.id} type="button" aria-label={drone.id} aria-pressed={selected === drone.id}
            onClick={() => selectDrone(drone.id)}
            className={`rounded-sm px-3 py-1.5 text-left ${focus} ${selected === drone.id ? 'bg-sea text-panel' : 'text-mute hover:bg-panel hover:text-ink'}`}>
            <span className="block font-semibold">{drone.id}</span>
            <span className="mt-0.5 block text-[10px]">{drone.location}</span>
          </button>
        ))}
      </div>
      <fieldset className="flex flex-wrap items-center gap-x-3 gap-y-2 px-1 text-[11px]">
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
