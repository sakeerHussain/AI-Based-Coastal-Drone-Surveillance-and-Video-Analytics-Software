import type { IncidentAction } from '../../features/incidents'

export const incidentActions: { id: IncidentAction; label: string; record: string; includeStation?: boolean }[] = [
  { id: 'request-patrol', label: 'Request patrol boat', record: 'Requested patrol boat from', includeStation: true },
  { id: 'escalate', label: 'Escalate to station', record: 'Escalated to Station House Officer at', includeStation: true },
  { id: 'acknowledge', label: 'Acknowledge', record: 'Acknowledged incident' },
  { id: 'export', label: 'Export evidence pack', record: 'Opened evidence pack with hash manifest' },
]
