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
    <div role="status" aria-live="polite" aria-atomic="true" className="shrink-0">
      {toast && <div className="border-b border-line border-l-4 border-l-red bg-paper px-4 py-3 text-sm text-ink">
        <p>High alert: {toast.title}</p>
        <button type="button" onClick={dismiss}
          className="mt-2 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">
          Dismiss
        </button>
      </div>}
    </div>
  )
}
