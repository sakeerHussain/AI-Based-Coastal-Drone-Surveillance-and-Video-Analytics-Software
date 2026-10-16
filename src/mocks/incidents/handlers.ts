import { http, HttpResponse } from 'msw'
import { incidentRecords } from './records'
import { incidentEvidence } from './evidence'
import { incidentActions } from './actions'

export const incidentsHandlers = [http.get('/api/incidents', () => HttpResponse.json({
  records: incidentRecords, evidence: incidentEvidence, actions: incidentActions,
}))]
