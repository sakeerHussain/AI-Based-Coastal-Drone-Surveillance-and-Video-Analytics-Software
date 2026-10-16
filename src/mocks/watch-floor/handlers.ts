import { http, HttpResponse } from 'msw'
import { surveillanceData } from './data'

export const surveillanceHandlers = [http.get('/api/surveillance', () => HttpResponse.json(surveillanceData))]
