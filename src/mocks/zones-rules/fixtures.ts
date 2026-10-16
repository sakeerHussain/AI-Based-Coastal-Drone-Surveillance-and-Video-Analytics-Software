import { zones } from '../watch-floor/zones'
import type { Rule, Zone, ZonesRulesData } from '../../features/zones-rules'

export const zoneTypes = ['Restricted area', 'Crowd monitoring', 'Harbour monitoring'] as const
export const ruleOptions = {
  object: ['vessel', 'person', 'vehicle', 'any object'],
  threshold: ['10 min', '5 min', '20 min'],
  hours: ['18:00 and 06:00', 'All day'],
  severity: ['High', 'Medium', 'Low'],
  notify: ['Munambam Station SHO', 'Coastal control room'],
  acknowledge: ['5 min', '2 min', '10 min'],
  escalate: ['DySP Coastal', 'Control room supervisor'],
} as const
export const defaultRule: Rule = {
  object: 'vessel', zoneId: '', threshold: '10 min', hours: '18:00 and 06:00',
  severity: 'High', notify: 'Munambam Station SHO', acknowledge: '5 min',
  escalate: 'DySP Coastal', sensitivity: 70,
}
const zoneDefinitions = [
  { id: 'Z-04', name: 'Restricted anchorage', type: zoneTypes[0], tone: 'red' },
  { id: 'Z-02', name: 'Beach crowd limit', type: zoneTypes[1], tone: 'amber' },
  { id: 'Z-07', name: 'Harbour mouth', type: zoneTypes[2], tone: 'sea' },
] as const
export const initialZonesRules: ZonesRulesData = {
  zones: zoneDefinitions.map((zone, index): Zone => ({
    ...zone, points: zones.features[index].geometry.coordinates[0].slice(0, -1)
      .map(([lng, lat]) => [lng, lat]),
  })),
  rules: {
    'Z-04': { ...defaultRule, zoneId: 'Z-04' },
    'Z-02': { ...defaultRule, zoneId: 'Z-02', object: 'person', hours: 'All day', severity: 'Medium' },
    'Z-07': { ...defaultRule, zoneId: 'Z-07', threshold: '20 min', severity: 'Low' },
  },
}
export const replaySettings = { durationMs: 1500, baseAlerts: 4, baseThreshold: 10, baseSensitivity: 70 }
