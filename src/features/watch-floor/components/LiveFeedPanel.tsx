import { SceneFrame } from '../../../components/SceneFrame'
import { useSurveillanceData } from '../../../lib/useSurveillanceData'
import { useWatchFloorStore } from '../store/useWatchFloorStore'

export function LiveFeedPanel() {
  const selected = useWatchFloorStore((state) => state.selectedDroneId)
  const { data } = useSurveillanceData()
  const drone = data?.drones.find((item) => item.id === selected)
  if (!data || !drone) return <p role="status" className="p-4 text-sm text-mute">Waiting for the selected feed…</p>
  return (
    <section aria-label="Selected drone live feed" className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-line px-3 py-2.5">
        <h2 className="text-sm font-semibold">Live feed</h2>
        <span className="flex items-center gap-1.5 text-[11px] text-green">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-green" />Live
        </span>
      </div>
      <div className="relative aspect-video min-h-[160px] overflow-hidden bg-ink xl:aspect-auto xl:flex-1">
        <svg viewBox="0 0 320 180" className="h-full w-full" role="img" aria-label={data.scenes[selected].description}>
          <g aria-hidden="true"><SceneFrame scene={data.scenes[selected]} /></g>
        </svg>
        <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded bg-ink/80 px-2 py-1 text-[10px] text-panel" aria-label="Recording">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-red" />Rec
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 border-b border-line px-3 py-2 text-xs">
        <span className="font-bold">{drone.id}</span>
        <span className="border-l border-line pl-2 text-mute">{drone.location}</span>
      </div>
    </section>
  )
}
