import { http, HttpResponse } from 'msw'
import { fleetData } from './fixtures'

export const fleetHandlers = [http.get('/api/fleet', () => HttpResponse.json(fleetData))]
