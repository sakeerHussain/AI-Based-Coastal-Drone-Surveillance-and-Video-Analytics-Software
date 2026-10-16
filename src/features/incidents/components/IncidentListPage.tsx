import { Link } from 'react-router-dom'
import { incidentRecords } from '../../../mocks/incidents/records'
import { formatIstTime } from '../../../lib/time'
import { useIncidentsStore } from '../store/useIncidentsStore'

const bars = { high: 'border-red', medium: 'border-amber', info: 'border-green' }
const labels = { high: 'High', medium: 'Medium', info: 'Info' }
export function IncidentListPage() {
  const acknowledged = useIncidentsStore((state) => state.acknowledged)
  const incidents = Object.values(incidentRecords).sort((a, b) => b.detectedAt - a.detectedAt)
  return (
    <section className="p-4" aria-labelledby="incident-list-title">
      <h1 id="incident-list-title" className="text-lg font-bold">Incidents</h1>
      {incidents.length === 0 ? <p className="mt-3 text-sm text-mute">No incidents to review.</p> : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <caption className="sr-only">Incidents available for review</caption>
            <thead className="border-b border-line text-mute">
              <tr>
                <th scope="col" className="px-4 py-2">Title</th>
                <th scope="col" className="px-3 py-2">Severity</th>
                <th scope="col" className="px-3 py-2">Drone</th>
                <th scope="col" className="px-3 py-2">Time</th>
                <th scope="col" className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-shoal">
                  <th scope="row" className={`border-l-4 px-4 py-3 font-semibold ${bars[incident.severity]}`}>
                    <Link to={`/incidents/${incident.id}`}
                      className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">
                      {incident.title}
                    </Link>
                  </th>
                  <td className="px-3 py-3">{labels[incident.severity]}</td>
                  <td className="whitespace-nowrap px-3 py-3">{incident.droneId}</td>
                  <td className="px-3 py-3">
                    <time dateTime={new Date(incident.detectedAt).toISOString()}>{formatIstTime(incident.detectedAt)}</time>
                  </td>
                  <td className="px-3 py-3">{acknowledged[incident.id] ? 'Acknowledged' : incident.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
