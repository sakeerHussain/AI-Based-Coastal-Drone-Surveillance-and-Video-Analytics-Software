import { http, HttpResponse } from 'msw'
import { modelRegistry, comparisonVersions, comparisonDefaults } from './registry'
import { modelDataset } from './dataset'

export const modelsHandlers = [http.get('/api/models', () => HttpResponse.json({
  models: modelRegistry, versions: comparisonVersions, dataset: modelDataset, comparisonDefaults,
}))]
