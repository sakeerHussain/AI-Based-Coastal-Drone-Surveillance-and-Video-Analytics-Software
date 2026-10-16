import { initialAlerts, highAlert } from '../mocks/watch-floor/alerts'
import { initialTelemetry, liveTiming, telemetrySteps } from '../mocks/watch-floor/telemetry'
import type { LiveDataClient, LiveEvent } from './liveDataTypes'
import { appLoadedAt, currentTime } from './time'
import { feedFixtures } from '../mocks/feed-wall/feeds'
import { initialHealth, healthSteps, healthTiming } from '../mocks/models/health'

export function createFakeLiveDataClient(): LiveDataClient {
  const listeners = new Set<(event: LiveEvent) => void>()
  let telemetry = structuredClone({ ...Object.fromEntries(feedFixtures.map((feed) => [feed.id, feed.telemetry])), ...initialTelemetry })
  let alerts = structuredClone(initialAlerts)
  let health = structuredClone(initialHealth)
  let healthTick = 0
  let tick = 0
  let interval: ReturnType<typeof setInterval> | undefined
  let alertTimer: ReturnType<typeof setTimeout> | undefined
  let healthInterval: ReturnType<typeof setInterval> | undefined
  let automaticAlerts = true
  function emit(event: LiveEvent) { listeners.forEach((listener) => listener(event)) }
  function stop() {
    clearInterval(interval); clearTimeout(alertTimer); clearInterval(healthInterval)
    interval = undefined; alertTimer = undefined; healthInterval = undefined
  }
  function snapshot(): LiveEvent { return { type: 'snapshot', alerts, telemetry, health } }
  function raiseHighAlert() {
    clearTimeout(alertTimer)
    if (alerts.some((alert) => alert.id === highAlert.id)) return
    const alert = { ...highAlert, createdAt: currentTime() }
    alerts = [alert, ...alerts]
    emit({ type: 'alert', alert })
  }
  function scheduleAlert() {
    clearTimeout(alertTimer)
    if (automaticAlerts && listeners.size && !alerts.some((alert) => alert.id === highAlert.id)) {
      alertTimer = setTimeout(raiseHighAlert, liveTiming.highAlertMs)
    }
  }
  function start() {
    if (!listeners.size || interval !== undefined) return
    healthInterval = setInterval(() => {
      const step = healthSteps[healthTick++ % healthSteps.length]
      health = { ...health,
        gpuLoad: Math.max(0, Math.min(100, health.gpuLoad + step.gpuLoad)),
        storageUsed: Number(Math.max(0, Math.min(100, health.storageUsed + step.storageUsed)).toFixed(1)),
        alertDelivery: Number(Math.max(0, Math.min(100, health.alertDelivery + step.alertDelivery)).toFixed(1)),
        inferenceDelay: Math.max(0, health.inferenceDelay + step.inferenceDelay),
        uptime: Number(Math.max(0, Math.min(100, health.uptime + step.uptime)).toFixed(2)),
      }
      emit({ type: 'health', health })
    }, healthTiming.intervalMs)
    interval = setInterval(() => {
      const step = telemetrySteps[tick % telemetrySteps.length]
      tick += 1
      telemetry = Object.fromEntries(Object.entries(telemetry).map(([id, value]) => [
        id, { ...value, altitude: value.altitude + step.altitude,
          heading: (value.heading + step.heading + 360) % 360,
          speed: Number((value.speed + step.speed).toFixed(1)) },
      ]))
      emit({ type: 'telemetry', telemetry })
    }, liveTiming.telemetryMs)
    scheduleAlert()
  }
  return {
    subscribe(callback) {
      listeners.add(callback)
      callback(snapshot())
      start()
      return () => { listeners.delete(callback); if (!listeners.size) stop() }
    },
    raiseHighAlert,
    setAutomaticAlerts(enabled) { automaticAlerts = enabled; scheduleAlert() },
    reset() {
      stop()
      telemetry = structuredClone({ ...Object.fromEntries(feedFixtures.map((feed) => [feed.id, feed.telemetry])), ...initialTelemetry })
      const offset = currentTime() - appLoadedAt
      alerts = structuredClone(initialAlerts).map((alert) => ({ ...alert, createdAt: alert.createdAt + offset }))
      health = structuredClone(initialHealth)
      tick = 0; healthTick = 0; automaticAlerts = true
      emit(snapshot())
      start()
    },
  }
}
export const liveDataClient = createFakeLiveDataClient()
