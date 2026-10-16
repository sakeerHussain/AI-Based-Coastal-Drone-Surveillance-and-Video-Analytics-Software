import type { SceneData } from '../../components/sceneTypes'
import type { Telemetry } from '../../lib/liveDataTypes'

export type FeedLayout = 3 | 2 | 1
export interface Feed {
  id: string
  title: string
  scene: SceneData
  telemetry: Telemetry
  incidentId?: string
}
export interface FeedWallData { feeds: Feed[]; capacity: number }
