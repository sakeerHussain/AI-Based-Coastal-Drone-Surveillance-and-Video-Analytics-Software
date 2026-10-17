import type { TrainingConfig } from '../../features/models/trainingTypes'
export const trainingFixture: TrainingConfig = {
  stepMs: 600, epochs: 5, evaluationSet: 'Coastal demo holdout · Fixed illustrative metrics',
  metrics: [
    { label: 'person', precision: 0.95, recall: 0.93, f1: 0.94 },
    { label: 'vehicle', precision: 0.92, recall: 0.90, f1: 0.91 },
    { label: 'vessel', precision: 0.96, recall: 0.94, f1: 0.95 },
  ],
  loss: [{ epoch: 1, loss: 0.48 }, { epoch: 2, loss: 0.34 }, { epoch: 3, loss: 0.26 }, { epoch: 4, loss: 0.20 }, { epoch: 5, loss: 0.17 }],
}
