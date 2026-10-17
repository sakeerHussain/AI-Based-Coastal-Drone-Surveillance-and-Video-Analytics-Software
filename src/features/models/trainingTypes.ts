import type { DatasetVersion } from '../datasets'
import type { ModelVersion } from './types'
export interface EvaluationMetric { label: string; precision: number; recall: number; f1: number }
export interface TrainingConfig { stepMs: number; epochs: number; evaluationSet: string; metrics: EvaluationMetric[]; loss: { epoch: number; loss: number }[] }
export interface TrainingJob {
  id: string; datasetName: string; snapshot: DatasetVersion; base: ModelVersion; requestedBy: string; requestedAt: string
  authorizedBy?: string; status: 'Awaiting authorization' | 'Training' | 'Completed'; progress: number
  config: TrainingConfig; candidateId?: string
}
