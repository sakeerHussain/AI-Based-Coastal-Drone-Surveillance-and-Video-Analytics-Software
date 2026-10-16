import { http, HttpResponse } from 'msw'
import { feedWallData } from './feeds'

export const feedWallHandlers = [http.get('/api/feeds', () => HttpResponse.json(feedWallData))]
