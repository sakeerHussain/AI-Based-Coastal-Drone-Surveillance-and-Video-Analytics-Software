import type { Incident } from '../../features/incidents'
import { appLoadedAt } from '../../lib/time'
import { highAlert, initialAlerts } from '../watch-floor/alerts'
import { drones } from '../watch-floor/drones'
import { scenes } from '../watch-floor/scenes'
import { initialTelemetry } from '../watch-floor/telemetry'

const details = {
  'vessel-z04': {
    object: 'Vessel, track V-0231', position: '10°10′19″N 76°09′36″E',
    rule: 'Dwell over 10 min in Z-04, 18:00 to 06:00', confidence: 94,
    station: 'Munambam Coastal Station', durationMinutes: 20, dwellMinutes: 14,
  },
  'crowd-cherai': {
    object: 'Crowd, 62 people', position: '10°08′20″N 76°10′41″E',
    rule: 'More than 50 people inside Z-02 Beach crowd', confidence: 91,
    station: 'Cherai Coastal Station', durationMinutes: 12, dwellMinutes: 8,
  },
  'jetty-kochi': {
    object: 'Stationary object, jetty track J-031', position: '9°58′34″N 76°14′13″E',
    rule: 'Stationary object on jetty for more than 20 min', confidence: 90,
    station: 'Fort Kochi Coastal Station', durationMinutes: 30, dwellMinutes: 22,
  },
  'zone-clear': {
    object: 'Vessel departed, zone clear', position: '9°59′06″N 76°13′08″E',
    rule: 'Notify when Z-07 clears after vessel departure', confidence: 93,
    station: 'Fort Kochi Coastal Station', durationMinutes: 8, dwellMinutes: 4,
  },
}
const alerts = [{ ...highAlert, createdAt: appLoadedAt - 14 * 60_000 }, ...initialAlerts]
export const incidentRecords: Record<string, Incident> = Object.fromEntries(alerts.map((alert) => {
  const detail = details[alert.id as keyof typeof details]
  const drone = drones.find((item) => item.id === alert.droneId)!
  const telemetry = initialTelemetry[alert.droneId]
  const durationSeconds = detail.durationMinutes * 60
  const enteredSeconds = durationSeconds * 0.1
  return [alert.id, {
    id: alert.id, title: alert.title, severity: alert.severity, droneId: alert.droneId,
    detectedAt: alert.createdAt, confidence: detail.confidence,
    status: alert.id === 'zone-clear' ? 'Resolved' : 'Open',
    station: detail.station, scene: scenes[alert.droneId],
    facts: [
      { label: 'Object', value: detail.object },
      { label: 'Position', value: detail.position },
      { label: 'Drone', value: `${drone.id} ${drone.location}` },
      { label: 'Altitude, speed', value: `${telemetry.altitude} m, ${telemetry.speed} m/s` },
      { label: 'Heading', value: `${telemetry.heading}°` },
      { label: 'Rule', value: detail.rule },
    ],
    playback: {
      startAt: alert.createdAt - durationSeconds * 1_000, durationSeconds, enteredSeconds,
      dwellEndSeconds: enteredSeconds + detail.dwellMinutes * 60,
      initialSeconds: durationSeconds * 0.62, frameRate: 25, demoDurationMs: 30_000,
    },
    initialActions: [{
      id: `${alert.id}-raised`, createdAt: alert.createdAt, person: 'System',
      text: `Alert raised: ${alert.title}`,
    }],
  } satisfies Incident]
}))
export const incidentDemoTiming = { toastMs: 5_000, reducedMotionUpdateMs: 1_000 }
