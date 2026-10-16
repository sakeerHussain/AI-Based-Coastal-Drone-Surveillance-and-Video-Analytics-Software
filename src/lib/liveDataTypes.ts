export type Severity = 'high' | 'medium' | 'info'
export interface Telemetry {
  altitude: number
  heading: number
  speed: number
  battery: number
}
export interface LiveAlert {
  id: string
  severity: Severity
  title: string
  droneId: string
  createdAt: number
  position: [number, number]
}
export interface SystemHealth {
  feedsLive: number
  feedCapacity: number
  gpuLoad: number
  storageUsed: number
  alertDelivery: number
  inferenceDelay: number
  lastBackup: string
  uptime: number
}
export type LiveEvent =
  | { type: 'snapshot'; alerts: LiveAlert[]; telemetry: Record<string, Telemetry>; health: SystemHealth }
  | { type: 'telemetry'; telemetry: Record<string, Telemetry> }
  | { type: 'health'; health: SystemHealth }
  | { type: 'alert'; alert: LiveAlert }
export interface LiveDataClient {
  subscribe: (callback: (event: LiveEvent) => void) => () => void
  reset: () => void
  raiseHighAlert: () => void
  setAutomaticAlerts: (enabled: boolean) => void
}
