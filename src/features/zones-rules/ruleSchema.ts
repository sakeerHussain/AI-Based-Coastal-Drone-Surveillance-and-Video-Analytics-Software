import { z } from 'zod'
import { ruleOptions, zoneTypes } from '../../mocks/zones-rules/fixtures'
import type { Rule, RuleErrors } from './types'

export const ruleSchema = z.object({
  object: z.enum(ruleOptions.object, { error: 'Choose an object to monitor.' }),
  zoneId: z.string().min(1, 'Choose a zone.'),
  threshold: z.enum(ruleOptions.threshold, { error: 'Choose a dwell time.' }),
  hours: z.enum(ruleOptions.hours, { error: 'Choose monitoring hours.' }),
  severity: z.enum(ruleOptions.severity, { error: 'Choose an alert severity.' }),
  notify: z.enum(ruleOptions.notify, { error: 'Choose who to notify.' }),
  acknowledge: z.enum(ruleOptions.acknowledge, { error: 'Choose an acknowledgement time.' }),
  escalate: z.enum(ruleOptions.escalate, { error: 'Choose who receives escalations.' }),
  sensitivity: z.number().int().min(0, 'Sensitivity must be at least 0.').max(100, 'Sensitivity must be at most 100.'),
})
export function validateRule(rule: Rule, zoneIds: string[]): RuleErrors {
  const result = ruleSchema.safeParse(rule)
  const errors: RuleErrors = {}
  if (!result.success) for (const issue of result.error.issues) {
    errors[issue.path[0] as keyof Rule] = issue.message
  }
  if (!zoneIds.includes(rule.zoneId)) errors.zoneId = 'Choose an existing zone.'
  return errors
}
export const newZoneSchema = z.object({
  name: z.string().trim().min(1, 'Enter a zone name.').max(60, 'Use 60 characters or fewer.'),
  type: z.enum(zoneTypes, { error: 'Choose a zone type.' }),
})
