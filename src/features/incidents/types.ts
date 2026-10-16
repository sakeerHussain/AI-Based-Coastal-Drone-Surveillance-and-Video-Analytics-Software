import type { SceneData } from '../../components/sceneTypes'
import type { Severity } from '../../lib/liveDataTypes'

export type IncidentAction = 'request-patrol' | 'escalate' | 'acknowledge' | 'export'
export interface ActionRecord {
  id: string
  createdAt: number
  person: string
  text: string
}
export interface IncidentPlayback {
  startAt: number
  durationSeconds: number
  enteredSeconds: number
  dwellEndSeconds: number
  initialSeconds: number
  frameRate: number
  demoDurationMs: number
}
export interface Incident {
  id: string
  title: string
  severity: Severity
  droneId: string
  detectedAt: number
  confidence: number
  status: 'Open' | 'Resolved'
  station: string
  scene: SceneData
  facts: { label: string; value: string }[]
  playback: IncidentPlayback
  initialActions: ActionRecord[]
}
export interface EvidenceFile {
  name: string
  kind: 'clip' | 'still'
  sha256: string
}
export interface EvidencePack {
  sha256: string
  sealedAt: number
  files: EvidenceFile[]
}
export interface IncidentActionDefinition {
  id: IncidentAction
  label: string
  record: string
  includeStation?: boolean
}
export interface IncidentsData {
  records: Record<string, Incident>
  evidence: Record<string, EvidencePack>
  actions: IncidentActionDefinition[]
}
