import type { TrainingConfig } from './trainingTypes'
export type ModelStage = 'Production' | 'Staging' | 'Awaiting approval'
export interface ModelVersion {
  id: string
  name: string
  version: string
  f1: number
  scores: Record<string, number>
}
export interface ModelRecord extends ModelVersion { stage: ModelStage; note: string }
export interface Dataset {
  annotatedFrames: number
  pendingClasses: string[]
}
export interface ModelsData {
  training: TrainingConfig
  models: ModelRecord[]
  versions: ModelVersion[]
  dataset: Dataset
  comparisonDefaults: [string, string]
}
