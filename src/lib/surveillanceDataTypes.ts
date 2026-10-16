import type { ChartData, ChartPosition } from '../components/chart'
import type { SceneData } from '../components/sceneTypes'

export interface SurveillanceData {
  chart: ChartData
  drones: { id: string; location: string; position: ChartPosition }[]
  scenes: Record<string, SceneData>
}
