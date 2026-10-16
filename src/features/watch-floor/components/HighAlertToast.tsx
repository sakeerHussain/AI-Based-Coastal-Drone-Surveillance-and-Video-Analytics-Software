import { useEffect } from 'react'
import { liveTiming } from '../../../mocks/watch-floor/telemetry'
import { useWatchFloorStore } from '../store/useWatchFloorStore'

export function HighAlertToast() {
  const toast = useWatchFloorStore((state) => state.toast)
  const dismiss = useWatchFloorStore((state) => state.dismissToast)
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(dismiss, liveTiming.toastMs)
    return () => clearTimeout(timer)
  }, [toast, dismiss])
  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="pointer-events-none fixed top-16 right-4 z-50 max-w-xs">
      {toast && <div className="pointer-events-auto rounded bg-ink px-4 py-3 text-sm text-paper shadow-lg">
        <p>High alert: {toast.title}</p>
        <button type="button" onClick={dismiss}
          className="mt-2 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper">
          Dismiss
        </button>
      </div>}
    </div>
  )
}
