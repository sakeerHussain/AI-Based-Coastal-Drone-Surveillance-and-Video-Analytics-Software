import { useModelsStore } from '../store/useModelsStore'

export function ModelToast() {
  const toast = useModelsStore((state) => state.toast)
  const dismiss = useModelsStore((state) => state.dismissToast)
  if (!toast) return null
  return <div className="fixed right-4 bottom-4 z-10 flex max-w-[calc(100%_-_2rem)] items-center gap-4 rounded border border-line border-l-4 border-l-green bg-panel p-4 text-sm">
    <p role="status">{toast}</p>
    <button type="button" onClick={dismiss}
      className="rounded px-2 py-1 font-semibold text-sea focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">Dismiss</button>
  </div>
}
