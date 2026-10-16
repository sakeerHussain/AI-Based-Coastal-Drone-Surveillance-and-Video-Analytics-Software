import type { ModelRecord, ModelVersion } from '../../features/models'

export const modelRegistry: ModelRecord[] = [
  { id: 'coastal-detect', name: 'coastal-detect', version: 'v3.2', f1: 0.91, stage: 'Production',
    note: 'Approved by DySP Coastal HQ, 02 Oct', scores: { person: 0.92, vehicle: 0.89, vessel: 0.93 } },
  { id: 'vessel-behaviour', name: 'vessel-behaviour', version: 'v1.4', f1: 0.87, stage: 'Staging',
    note: 'Testing on Munambam footage', scores: { person: 0.84, vehicle: 0.85, vessel: 0.92 } },
  { id: 'thermal-night', name: 'thermal-night', version: 'v0.9', f1: 0.78, stage: 'Awaiting approval',
    note: 'Needs authority sign-off', scores: { person: 0.81, vehicle: 0.74, vessel: 0.79 } },
]
export const comparisonVersions: ModelVersion[] = [
  ...modelRegistry,
  { id: 'coastal-detect-v3.3', name: 'coastal-detect', version: 'v3.3', f1: 0.93,
    scores: { person: 0.94, vehicle: 0.91, vessel: 0.95 } },
]
export const comparisonDefaults: [string, string] = ['coastal-detect', 'coastal-detect-v3.3']
