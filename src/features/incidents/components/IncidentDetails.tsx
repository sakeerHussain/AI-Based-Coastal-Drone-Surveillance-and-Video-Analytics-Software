import { formatIstTime } from '../../../lib/time'
import { IncidentActions } from './IncidentActions'
import type { Incident, EvidencePack, IncidentActionDefinition } from '../types'

const severityStyle = { high: 'border-red', medium: 'border-amber', info: 'border-green' }
const severityLabel = { high: 'High', medium: 'Medium', info: 'Info' }
export function IncidentDetails({ incident, evidence, actions, onExport }: {
  incident: Incident; evidence: EvidencePack; actions: IncidentActionDefinition[]; onExport: () => void
}) {
  const clips = evidence.files.filter((file) => file.kind === 'clip').length
  const stills = evidence.files.filter((file) => file.kind === 'still').length
  return (
    <aside aria-label="Incident details" className="border-t border-line bg-panel p-4 xl:border-t-0 xl:border-l">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded border-l-4 bg-paper px-2 py-0.5 text-xs font-bold text-ink ${severityStyle[incident.severity]}`}>
          {severityLabel[incident.severity]}
        </span>
        <span className="text-sm text-mute">
          Detected {formatIstTime(incident.detectedAt)}, {incident.confidence}% confidence
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-[110px_minmax(0,1fr)] gap-y-2 text-sm">
        {incident.facts.map((fact) => (
          <div key={fact.label} className="contents">
            <dt className="text-mute">{fact.label}</dt>
            <dd className="break-words font-medium">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 rounded bg-shoal p-3 text-xs">
        <h2 className="font-semibold">Evidence sealed</h2>
        <p className="mt-1 break-all text-ink">SHA-256 {evidence.sha256}</p>
        <p className="mt-1 text-ink">
          Stored {formatIstTime(evidence.sealedAt)} IST, {clips} clips and {stills} stills
        </p>
      </div>
      <IncidentActions incident={incident} actions={actions} onExport={onExport} />
    </aside>
  )
}
