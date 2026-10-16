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
export type LiveEvent =
  | { type: 'snapshot'; alerts: LiveAlert[]; telemetry: Record<string, Telemetry> }
  | { type: 'telemetry'; telemetry: Record<string, Telemetry> }
  | { type: 'alert'; alert: LiveAlert }
export interface LiveDataClient {
  subscribe: (callback: (event: LiveEvent) => void) => () => void
}
