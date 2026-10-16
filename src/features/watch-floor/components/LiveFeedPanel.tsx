import { SceneFrame } from '../../../components/SceneFrame'
import { drones } from '../../../mocks/watch-floor/drones'
import { scenes } from '../../../mocks/watch-floor/scenes'
import { useWatchFloorStore } from '../store/useWatchFloorStore'

export function LiveFeedPanel() {
  const selected = useWatchFloorStore((state) => state.selectedDroneId)
  const drone = drones.find((item) => item.id === selected)!
  return (
    <section aria-label="Selected drone live feed" className="relative aspect-video shrink-0 overflow-hidden bg-ink">
      <SceneFrame scene={scenes[selected]} />
      <div className="absolute top-2 left-2 rounded bg-ink/70 px-2 py-0.5 text-[11px] font-semibold text-panel">
        {drone.id} {drone.location}, live
      </div>
      <div className="absolute top-2 right-2 flex items-center gap-1 text-[11px] text-panel" aria-label="Recording">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-red" />Rec
      </div>
    </section>
  )
}
