import { http, HttpResponse } from 'msw'
import { sourcesData } from './fixtures'

export const sourcesHandlers = [http.get('/api/video-sources', () => HttpResponse.json(sourcesData))]
