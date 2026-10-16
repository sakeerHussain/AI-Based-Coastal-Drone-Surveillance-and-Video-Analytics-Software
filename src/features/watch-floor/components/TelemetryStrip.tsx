import { useWatchFloorStore } from '../store/useWatchFloorStore'
import { TelemetryStrip as SharedTelemetryStrip } from '../../../components/TelemetryStrip'

export function TelemetryStrip() {
  const selected = useWatchFloorStore((state) => state.selectedDroneId)
  const telemetry = useWatchFloorStore((state) => state.telemetry[selected])
  return <SharedTelemetryStrip telemetry={telemetry} />
}
