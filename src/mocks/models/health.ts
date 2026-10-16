import type { SystemHealth } from '../../lib/liveDataTypes'

export const initialHealth: SystemHealth = {
  feedsLive: 18, feedCapacity: 20, gpuLoad: 71, storageUsed: 63, alertDelivery: 99,
  inferenceDelay: 180, lastBackup: '03:00 today', uptime: 99.96,
}
export const healthTiming = { intervalMs: 4000 }
export const healthSteps = [
  { gpuLoad: 1, storageUsed: 0.1, alertDelivery: -0.1, inferenceDelay: 2, uptime: -0.01 },
  { gpuLoad: -2, storageUsed: 0.1, alertDelivery: 0.2, inferenceDelay: -5, uptime: 0.01 },
  { gpuLoad: 1, storageUsed: -0.2, alertDelivery: -0.1, inferenceDelay: 3, uptime: 0 },
]
