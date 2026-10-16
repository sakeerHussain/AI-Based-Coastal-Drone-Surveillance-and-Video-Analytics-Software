import { http, HttpResponse } from 'msw'
import { initialZonesRules } from './fixtures'

export const zonesRulesHandlers = [
  http.get('/api/zones-rules', () => HttpResponse.json(initialZonesRules)),
]
