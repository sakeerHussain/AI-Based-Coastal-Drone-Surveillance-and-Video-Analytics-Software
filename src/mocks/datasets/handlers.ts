import { http, HttpResponse } from 'msw'
import { datasetsFixture } from './fixtures'
export const datasetsHandlers = [http.get('/api/datasets', () => HttpResponse.json(datasetsFixture))]
