import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useIncidentsData } from '../api/incidents'
import { IncidentVideo } from './IncidentVideo'
import { IncidentTimeline } from './IncidentTimeline'
import { RecordOfActions } from './RecordOfActions'
import { IncidentDetails } from './IncidentDetails'
import { EvidenceDialog } from './EvidenceDialog'
import { IncidentToast } from './IncidentToast'
import type { Incident, IncidentsData } from '../types'

function IncidentReview({ incident, data }: { incident: Incident; data: IncidentsData }) {
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
      <IncidentDetails incident={incident} evidence={data.evidence[incident.id]} actions={data.actions} onExport={() => setExportOpen(true)} />
      {exportOpen && <EvidenceDialog incident={incident} evidence={data.evidence[incident.id]} onClose={() => setExportOpen(false)} />}
      <IncidentToast />
    </div>
  )
}
export function IncidentReviewPage() {
  const { id } = useParams()
  const query = useIncidentsData()
  if (query.isError) return <div role="alert" className="p-4 text-sm">Could not load incident.
    <button type="button" onClick={() => void query.refetch()}
      className="ml-3 underline focus-visible:outline-2 focus-visible:outline-sea">Try again</button></div>
  if (!query.ready) return <p role="status" className="p-4 text-sm">Loading incident…</p>
  const data = query.data!
  const incident = id && Object.hasOwn(data.records, id) ? data.records[id] : undefined
  if (!incident) return (
    <section className="p-4">
      <h1 className="text-lg font-bold">Incident not found</h1>
      <Link to="/incidents"
        className="mt-3 inline-block text-sm text-sea underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">
        Back to incidents
      </Link>
    </section>
  )
  return <IncidentReview key={incident.id} incident={incident} data={data} />
}
