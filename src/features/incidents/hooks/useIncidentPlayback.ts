import { useEffect, useRef, useState } from 'react'
import { incidentDemoTiming } from '../../../mocks/incidents/records'
import type { IncidentPlayback } from '../types'

export function formatPlaybackTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}
export function useIncidentPlayback(playback: IncidentPlayback) {
  const [seconds, setSeconds] = useState(playback.initialSeconds)
  const [playing, setPlaying] = useState(false)
  const cursor = useRef(playback.initialSeconds)
  useEffect(() => {
    if (!playing) return
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let frame: number
    let lastFrame: number | undefined
    let lastPublished: number | undefined
    let position = cursor.current
    function animate(timestamp: number) {
      if (lastFrame !== undefined) {
        position = Math.min(playback.durationSeconds,
          position + (timestamp - lastFrame) * playback.durationSeconds / playback.demoDurationMs)
      }
      lastFrame = timestamp
      cursor.current = position
      if (!motion.matches || lastPublished === undefined
        || timestamp - lastPublished >= incidentDemoTiming.reducedMotionUpdateMs
        || position === playback.durationSeconds) {
        setSeconds(position)
        lastPublished = timestamp
      }
      if (position === playback.durationSeconds) {
        setPlaying(false)
        return
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [playing, playback])
  function togglePlay() {
    if (cursor.current >= playback.durationSeconds) {
      cursor.current = 0
    }
    setSeconds(cursor.current)
    setPlaying((value) => !value)
  }
  function stepFrame() {
    setPlaying(false)
    const nextFrame = Math.round(cursor.current * playback.frameRate) + 1
    cursor.current = Math.min(playback.durationSeconds, nextFrame / playback.frameRate)
    setSeconds(cursor.current)
  }
  return { seconds, playing, togglePlay, stepFrame }
}
