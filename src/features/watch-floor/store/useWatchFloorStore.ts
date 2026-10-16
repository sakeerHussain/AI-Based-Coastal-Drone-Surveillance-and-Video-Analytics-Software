import { create } from 'zustand'
import type { LiveAlert, LiveEvent, Telemetry } from '../../../lib/liveDataTypes'
import { defaultDroneId } from '../../../mocks/watch-floor/drones'
import type { LayerVisibility } from '../types'

interface WatchFloorState {
  selectedDroneId: string
  alerts: LiveAlert[]
  telemetry: Record<string, Telemetry>
  toast: LiveAlert | null
  layers: LayerVisibility
  selectDrone: (id: string) => void
  toggleLayer: (layer: keyof LayerVisibility) => void
  receive: (event: LiveEvent) => void
  dismissToast: () => void
}
export const useWatchFloorStore = create<WatchFloorState>((set) => ({
  selectedDroneId: defaultDroneId, alerts: [], telemetry: {}, toast: null,
  layers: { zones: true, tracks: true, detections: true },
  selectDrone: (selectedDroneId) => set({ selectedDroneId }),
  toggleLayer: (layer) => set((state) => ({ layers: { ...state.layers, [layer]: !state.layers[layer] } })),
  dismissToast: () => set({ toast: null }),
  receive: (event) => set((state) => {
    if (event.type === 'snapshot') return { alerts: event.alerts, telemetry: event.telemetry }
    if (event.type === 'telemetry') return { telemetry: event.telemetry }
    if (event.type !== 'alert') return state
    if (state.alerts.some((alert) => alert.id === event.alert.id)) return state
    return { alerts: [event.alert, ...state.alerts], toast: event.alert.severity === 'high' ? event.alert : state.toast }
  }),
}))
