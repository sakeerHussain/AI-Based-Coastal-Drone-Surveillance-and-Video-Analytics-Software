import type { SceneData } from '../../components/sceneTypes'
import { scenes } from '../watch-floor/scenes'

export const feedScenes: Record<'sea' | 'beach' | 'harbour', SceneData> = {
  sea: {
    description: 'Open sea patrol with two vessels', sand: false, zone: false,
    objects: [
      { x: 70, y: 80, width: 36, height: 18, label: 'Vessel 93%', tone: 'green', kind: 'vessel' },
      { x: 220, y: 50, width: 30, height: 14, label: 'Boat 90%', tone: 'green', kind: 'vessel' },
    ],
  },
  beach: scenes['KP-D12'],
  harbour: {
    description: 'Harbour patrol with moored boats and a vehicle', sand: true, zone: false,
    objects: [
      { x: 55, y: 85, width: 32, height: 16, label: 'Boat 95%', tone: 'green', kind: 'vessel' },
      { x: 140, y: 100, width: 38, height: 18, label: 'Vessel 92%', tone: 'green', kind: 'vessel' },
      { x: 245, y: 145, width: 30, height: 14, label: 'Vehicle', tone: 'green', kind: 'vehicle' },
    ],
  },
}
