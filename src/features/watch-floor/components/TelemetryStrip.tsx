import { useWatchFloorStore } from '../store/useWatchFloorStore'

export function TelemetryStrip() {
  const selected = useWatchFloorStore((state) => state.selectedDroneId)
  const telemetry = useWatchFloorStore((state) => state.telemetry[selected])
  const values = [
    ['Altitude', telemetry ? `${telemetry.altitude} m` : '—'],
    ['Heading', telemetry ? `${telemetry.heading}°` : '—'],
    ['Speed', telemetry ? `${telemetry.speed.toFixed(1)} m/s` : '—'],
    ['Battery', telemetry ? `${telemetry.battery}%` : '—'],
  ]
  return (
    <dl aria-label="Drone telemetry" className="grid shrink-0 grid-cols-4 border-b border-line text-center">
      {values.map(([label, value]) => (
        <div key={label} className="flex flex-col border-r border-line py-2 last:border-0">
          <dt className="order-2 text-xs text-mute">{label}</dt>
          <dd className="font-bold">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
