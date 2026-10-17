import type { Feed, FeedWallData } from '../../features/feed-wall'
import { scenes } from '../watch-floor/scenes'
import { initialTelemetry } from '../watch-floor/telemetry'
import { feedScenes } from './scenes'

const definitions = [
  ['KP-D07', 'Munambam', 'sea', 'vessel-z04'],
  ['KP-D12', 'Cherai', 'beach', 'crowd-cherai'],
  ['KP-D03', 'Fort Kochi', 'harbour'],
  ['KP-D15', 'Vypin', 'sea'],
  ['KP-D09', 'Kodungallur', 'harbour'],
  ['KP-D04', 'Azhikode', 'beach'],
  ['KP-D11', 'Chellanam', 'sea'],
  ['KP-D02', 'Njarakkal', 'harbour'],
  ['KP-D18', 'Puthuvype', 'beach'],
  ['KP-D01', 'Kuzhuppilly', 'beach'],
  ['KP-D05', 'Andhakaranazhy', 'sea'],
  ['KP-D06', 'Thoppumpady', 'harbour'],
  ['KP-D08', 'Pallippuram', 'sea'],
  ['KP-D10', 'Mararikulam', 'beach'],
  ['KP-D13', 'Kumbalangi', 'harbour'],
  ['KP-D14', 'Edavanakkad', 'beach'],
  ['KP-D16', 'Alappuzha', 'sea'],
  ['KP-D17', 'Cochin port', 'harbour'],
] as const
export const feedFixtures: Feed[] = definitions.map(([id, location, variant, incidentId], index) => ({
  id, title: `${id} ${location}`, incidentId,
  resolution: '1080p', frameRate: 25,
  scene: scenes[id] ?? feedScenes[variant],
  telemetry: initialTelemetry[id] ?? {
    altitude: 90 + index * 2, heading: (120 + index * 17) % 360,
    speed: Number((6 + index * 0.2).toFixed(1)), battery: 90 - index * 2,
  },
}))
export const feedWallData: FeedWallData = { feeds: feedFixtures, capacity: 20 }
