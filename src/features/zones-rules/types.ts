import type { ChartPosition } from '../../components/chart'

export type ZoneType = 'Restricted area' | 'Crowd monitoring' | 'Harbour monitoring'
export interface Zone {
  id: string
  name: string
  type: ZoneType
  tone: 'red' | 'amber' | 'sea'
  points: ChartPosition[]
}
export interface Rule {
  object: string
  zoneId: string
  threshold: string
  hours: string
  severity: string
  notify: string
  acknowledge: string
  escalate: string
  sensitivity: number
}
export interface ZonesRulesData { zones: Zone[]; rules: Record<string, Rule> }
export type RuleErrors = Partial<Record<keyof Rule, string>>
