import { initialAlerts, highAlert } from '../mocks/watch-floor/alerts'
import { initialTelemetry, liveTiming, telemetrySteps } from '../mocks/watch-floor/telemetry'
import type { LiveDataClient, LiveEvent } from './liveDataTypes'
import { currentTime } from './time'

export function createFakeLiveDataClient(): LiveDataClient {
  const listeners = new Set<(event: LiveEvent) => void>()
  let telemetry = structuredClone(initialTelemetry)
  let alerts = structuredClone(initialAlerts)
  let tick = 0
  let interval: ReturnType<typeof setInterval> | undefined
  let alertTimer: ReturnType<typeof setTimeout> | undefined
  function emit(event: LiveEvent) { listeners.forEach((listener) => listener(event)) }
  return {
    subscribe(callback) {
      listeners.add(callback)
      callback({ type: 'snapshot', alerts, telemetry })
      if (listeners.size === 1) {
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
        }
      }
    },
  }
}
export const liveDataClient = createFakeLiveDataClient()
