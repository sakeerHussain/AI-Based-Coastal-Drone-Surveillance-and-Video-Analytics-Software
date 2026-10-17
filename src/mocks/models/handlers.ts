import { http, HttpResponse } from 'msw'
import { modelRegistry, comparisonVersions, comparisonDefaults } from './registry'
import { modelDataset } from './dataset'
import { trainingFixture } from './training'

export const modelsHandlers = [http.get('/api/models', () => HttpResponse.json({
  models: modelRegistry, versions: comparisonVersions, dataset: modelDataset, comparisonDefaults, training: trainingFixture,
}))]
