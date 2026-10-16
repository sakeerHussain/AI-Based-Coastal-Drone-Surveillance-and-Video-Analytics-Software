import type { SceneData } from '../../components/sceneTypes'

export const scenes: Record<string, SceneData> = {
  'KP-D07': {
    description: 'Munambam sea scene with a vessel in the restricted zone',
    sand: true, zone: true,
    objects: [
      { x: 142, y: 62, width: 48, height: 24, label: 'Vessel V-0231 94%', tone: 'red', kind: 'vessel' },
      { x: 40, y: 54, width: 30, height: 14, label: 'Boat 91%', tone: 'green', kind: 'vessel' },
      { x: 230, y: 138, width: 12, height: 12, label: 'Person', tone: 'green', kind: 'person' },
    ],
  },
  'KP-D12': {
    description: 'Cherai beach scene with people and a vehicle',
    sand: true, zone: false,
    objects: [
      { x: 60, y: 140, width: 10, height: 10, label: 'Person', tone: 'green', kind: 'person' },
      { x: 100, y: 140, width: 10, height: 10, label: 'Person', tone: 'green', kind: 'person' },
      { x: 130, y: 150, width: 10, height: 10, label: 'Person', tone: 'amber', kind: 'person' },
      { x: 170, y: 134, width: 34, height: 16, label: 'Vehicle', tone: 'green', kind: 'vehicle' },
    ],
  },
  'KP-D03': {
    description: 'Fort Kochi sea scene with three boats',
    sand: true, zone: false,
    objects: [
      { x: 50, y: 50, width: 34, height: 16, label: 'Boat 93%', tone: 'green', kind: 'vessel' },
      { x: 140, y: 90, width: 38, height: 18, label: 'Boat 90%', tone: 'green', kind: 'vessel' },
      { x: 230, y: 40, width: 30, height: 14, label: 'Boat 88%', tone: 'green', kind: 'vessel' },
    ],
  },
}
