import { formatIstTime } from '../../lib/time'
import type { EvidencePack, Incident } from './types'

export function createEvidenceManifest(incident: Incident, evidence: EvidencePack): string {
  return [
    'Demo evidence manifest',
    `Incident: ${incident.id}`,
    `Title: ${incident.title}`,
    `Sealed at: ${formatIstTime(evidence.sealedAt, true)} IST`,
    `Pack SHA-256: ${evidence.sha256}`,
    '',
    'SHA-256  File',
    ...evidence.files.map((file) => `${file.sha256}  ${file.name}`),
    '',
  ].join('\n')
}
export function downloadEvidenceManifest(incident: Incident, evidence: EvidencePack) {
  const blob = new Blob([createEvidenceManifest(incident, evidence)], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${incident.id}-manifest.txt`
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1_000)
}
