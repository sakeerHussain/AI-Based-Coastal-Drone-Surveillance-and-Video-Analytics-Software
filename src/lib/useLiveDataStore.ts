import { create } from 'zustand'
import type { LiveEvent, SystemHealth, Telemetry } from './liveDataTypes'

interface LiveDataState {
  reset: () => void
  telemetry: Record<string, Telemetry>
  health: SystemHealth | null
  receive: (event: LiveEvent) => void
}
export const useLiveDataStore = create<LiveDataState>((set) => ({
  reset: () => set({ telemetry: {}, health: null }),
  telemetry: {}, health: null,
  receive: (event) => {
    if (event.type === 'snapshot' || event.type === 'health') set({ health: event.health })
    if (event.type === 'snapshot' || event.type === 'telemetry') set({ telemetry: event.telemetry })
  },
}))
