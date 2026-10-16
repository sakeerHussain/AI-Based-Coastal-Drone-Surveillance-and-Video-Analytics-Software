import { useEffect, useRef, useState } from 'react'
import { replaySettings } from '../../../mocks/zones-rules/fixtures'
import type { Rule } from '../types'

interface Replay { key: string; progress: number; result: number | null }
export function useRuleReplay(rule: Rule) {
  const key = JSON.stringify(rule)
  const [replay, setReplay] = useState<Replay | null>(null)
  const interval = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => { clearInterval(interval.current); clearTimeout(timeout.current) }, [key])
  function run() {
    clearInterval(interval.current); clearTimeout(timeout.current)
    setReplay({ key, progress: 0, result: null })
    const started = performance.now()
    interval.current = setInterval(() => {
      setReplay({ key, progress: Math.min(95, Math.round((performance.now() - started) / replaySettings.durationMs * 100)), result: null })
    }, 100)
    timeout.current = setTimeout(() => {
      clearInterval(interval.current)
      const result = Math.round(replaySettings.baseAlerts * replaySettings.baseThreshold / parseInt(rule.threshold)
        * rule.sensitivity / replaySettings.baseSensitivity)
      setReplay({ key, progress: 100, result })
    }, replaySettings.durationMs)
  }
  const current = replay?.key === key ? replay : null
  return { run, busy: current !== null && current.result === null, result: current?.result ?? null,
    progress: current?.progress ?? 0, stale: replay !== null && replay.key !== key }
}
