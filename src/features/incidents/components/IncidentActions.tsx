import { useAuthStore } from '../../auth'
import { useIncidentsStore } from '../store/useIncidentsStore'
import type { Incident, IncidentAction, IncidentActionDefinition } from '../types'

export function IncidentActions({ incident, actions, onExport }: {
  incident: Incident; actions: IncidentActionDefinition[]; onExport: () => void
}) {
  const user = useAuthStore((state) => state.user)
  const acknowledged = useIncidentsStore((state) => Boolean(state.acknowledged[incident.id]))
  const recordAction = useIncidentsStore((state) => state.recordAction)
  function act(action: IncidentAction) {
    if (!user) return
    if (recordAction(incident.id, action, user.name) && action === 'export') onExport()
  }
  return (
    <div className="mt-4 grid gap-2 text-sm font-semibold">
      {actions.map((action) => (
        <button key={action.id} type="button" onClick={() => act(action.id)}
          disabled={!user || (action.id === 'acknowledge' && acknowledged)}
          className={`rounded py-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea disabled:cursor-default disabled:bg-paper disabled:text-mute ${action.id === 'request-patrol' ? 'bg-sea text-panel' : 'border border-line bg-panel'}`}>
          {action.id === 'acknowledge' && acknowledged ? 'Acknowledged' : action.label}
        </button>
      ))}
    </div>
  )
}
