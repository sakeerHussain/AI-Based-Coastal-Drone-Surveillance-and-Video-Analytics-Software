import { initialAlerts, highAlert } from '../mocks/watch-floor/alerts'
import { initialTelemetry, liveTiming, telemetrySteps } from '../mocks/watch-floor/telemetry'
import type { LiveDataClient, LiveEvent } from './liveDataTypes'
import { currentTime } from './time'
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
  function emit(event: LiveEvent) { listeners.forEach((listener) => listener(event)) }
  return {
    subscribe(callback) {
      listeners.add(callback)
      callback({ type: 'snapshot', alerts, telemetry, health })
      if (listeners.size === 1) {
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
        if (!alerts.some((alert) => alert.id === highAlert.id)) {
          alertTimer = setTimeout(() => {
            const alert = { ...highAlert, createdAt: currentTime() }
            alerts = [alert, ...alerts]
            emit({ type: 'alert', alert })
          }, liveTiming.highAlertMs)
        }
      }
      return () => {
        listeners.delete(callback)
        if (listeners.size === 0) {
          clearInterval(interval)
          clearTimeout(alertTimer)
          clearInterval(healthInterval)
        }
      }
    },
  }
}
export const liveDataClient = createFakeLiveDataClient()
