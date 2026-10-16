import { useEffect } from 'react'
import { incidentDemoTiming } from '../../../mocks/incidents/records'
import { useIncidentsStore } from '../store/useIncidentsStore'

export function IncidentToast() {
  const toast = useIncidentsStore((state) => state.toast)
  const dismiss = useIncidentsStore((state) => state.dismissToast)
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(dismiss, incidentDemoTiming.toastMs)
    return () => clearTimeout(timer)
  }, [toast, dismiss])
  useEffect(() => () => dismiss(), [dismiss])
  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="pointer-events-none fixed top-16 right-4 z-50 max-w-xs">
      {toast && <div className="pointer-events-auto rounded bg-ink px-4 py-3 text-sm text-paper shadow-lg">
        <p>{toast.text}</p>
        <button type="button" onClick={dismiss}
          className="mt-2 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper">
          Dismiss
        </button>
      </div>}
    </div>
  )
}
