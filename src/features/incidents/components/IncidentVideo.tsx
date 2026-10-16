import { SceneFrame } from '../../../components/SceneFrame'
import { formatIstTime } from '../../../lib/time'
import type { Incident } from '../types'

export function IncidentVideo({ incident }: { incident: Incident }) {
  const endAt = incident.playback.startAt + incident.playback.durationSeconds * 1_000
  return (
    <div className="relative mt-3 aspect-video overflow-hidden rounded-sm bg-ink">
      <SceneFrame scene={incident.scene} />
      <span className="absolute top-2 left-2 rounded bg-ink/70 px-2 py-0.5 text-[11px] text-panel">
        {incident.droneId}, {formatIstTime(incident.playback.startAt)} to {formatIstTime(endAt)} IST
      </span>
    </div>
  )
}
