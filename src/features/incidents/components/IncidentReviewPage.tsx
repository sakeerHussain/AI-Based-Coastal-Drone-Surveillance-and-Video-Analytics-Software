import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { incidentRecords } from '../../../mocks/incidents/records'
import { IncidentVideo } from './IncidentVideo'
import { IncidentTimeline } from './IncidentTimeline'
import { RecordOfActions } from './RecordOfActions'
import { IncidentDetails } from './IncidentDetails'
import { EvidenceDialog } from './EvidenceDialog'
import { IncidentToast } from './IncidentToast'
import type { Incident } from '../types'

function IncidentReview({ incident }: { incident: Incident }) {
  const [exportOpen, setExportOpen] = useState(false)
  return (
    <div className="grid min-h-full xl:grid-cols-[minmax(0,1fr)_400px]">
      <section className="min-w-0 p-4" aria-labelledby="incident-review-title">
        <Link to="/incidents"
          className="text-sm text-sea underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">
          Back to incidents
        </Link>
        <div className="mt-2 text-sm text-mute">Incident {incident.id}</div>
        <h1 id="incident-review-title" className="text-xl font-bold leading-snug">{incident.title}</h1>
        <IncidentVideo incident={incident} />
        <IncidentTimeline incident={incident} />
        <RecordOfActions incidentId={incident.id} />
      </section>
      <IncidentDetails incident={incident} onExport={() => setExportOpen(true)} />
      {exportOpen && <EvidenceDialog incident={incident} onClose={() => setExportOpen(false)} />}
      <IncidentToast />
    </div>
  )
}
export function IncidentReviewPage() {
  const { id } = useParams()
  const incident = id && Object.hasOwn(incidentRecords, id) ? incidentRecords[id] : undefined
  if (!incident) return (
    <section className="p-4">
      <h1 className="text-lg font-bold">Incident not found</h1>
      <Link to="/incidents"
        className="mt-3 inline-block text-sm text-sea underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">
        Back to incidents
      </Link>
    </section>
  )
  return <IncidentReview key={incident.id} incident={incident} />
}
