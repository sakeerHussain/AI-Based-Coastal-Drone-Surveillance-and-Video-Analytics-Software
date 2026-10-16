import type { Telemetry } from '../../lib/liveDataTypes'

export const initialTelemetry: Record<string, Telemetry> = {
  'KP-D07': { altitude: 118, heading: 214, speed: 9.4, battery: 62 },
  'KP-D12': { altitude: 92, heading: 178, speed: 6.2, battery: 78 },
  'KP-D03': { altitude: 105, heading: 32, speed: 7.8, battery: 85 },
}
export const liveTiming = { telemetryMs: 2_000, highAlertMs: 20_000, toastMs: 8_000 }
export const telemetrySteps = [
  { altitude: 1, heading: 1, speed: 0.1 },
  { altitude: 0, heading: -1, speed: -0.1 },
  { altitude: -1, heading: 0, speed: 0 },
]
