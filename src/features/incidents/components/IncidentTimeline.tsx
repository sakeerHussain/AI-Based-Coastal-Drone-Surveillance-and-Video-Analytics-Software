import { useNavigate } from 'react-router-dom'
import { formatPlaybackTime, useIncidentPlayback } from '../hooks/useIncidentPlayback'
import type { Incident } from '../types'

const button = 'rounded border border-line bg-panel px-3 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'
export function IncidentTimeline({ incident }: { incident: Incident }) {
  const { seconds, playing, togglePlay, stepFrame } = useIncidentPlayback(incident.playback)
  const navigate = useNavigate()
  const timeline = incident.playback
  const entered = timeline.enteredSeconds / timeline.durationSeconds * 100
  const dwell = (timeline.dwellEndSeconds - timeline.enteredSeconds) / timeline.durationSeconds * 100
  const progress = seconds / timeline.durationSeconds * 100
  return (
    <div className="mt-8">
      <div role="progressbar" aria-label="Playback position" aria-valuemin={0}
        aria-valuemax={timeline.durationSeconds} aria-valuenow={Number(seconds.toFixed(3))}
        aria-valuetext={`${formatPlaybackTime(seconds)} of ${formatPlaybackTime(timeline.durationSeconds)}`}
        className="relative h-10 rounded bg-shoal">
        <div aria-hidden="true" className="absolute inset-y-0 left-0 rounded-l bg-sea/30" style={{ width: `${progress}%` }} />
        <div aria-hidden="true" className="absolute inset-y-0 border-x-2 border-red"
          style={{ left: `${entered}%`, width: `${dwell}%` }} />
        <span aria-hidden="true" className="absolute -top-5 text-xs font-semibold text-red" style={{ left: `${entered}%` }}>
          Entered zone
        </span>
        <span aria-hidden="true" className="absolute top-2.5 text-xs" style={{ left: `${entered + dwell / 2}%`, transform: 'translateX(-50%)' }}>
          Dwell {Math.round((timeline.dwellEndSeconds - timeline.enteredSeconds) / 60)} min
        </span>
        <div aria-hidden="true" className="absolute inset-y-0 w-0.5 bg-ink" style={{ left: `${progress}%` }} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <button type="button" onClick={togglePlay} className={button}>{playing ? 'Pause' : 'Play'}</button>
        <button type="button" onClick={stepFrame} disabled={seconds >= timeline.durationSeconds}
          className={`${button} disabled:text-mute`}>Step frame</button>
        <button type="button" onClick={() => navigate(`/watch-floor?drone=${incident.droneId}&track=1`)}
          className={button}>Show track on chart</button>
        <span className="ml-auto text-xs text-mute">{formatPlaybackTime(seconds)} / {formatPlaybackTime(timeline.durationSeconds)}</span>
      </div>
    </div>
  )
}
