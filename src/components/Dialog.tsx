import { useEffect, useId, useRef, type ReactNode } from 'react'

export function Dialog({ title, onClose, children, fullScreen = false }: {
  title: string; onClose: () => void; children: ReactNode; fullScreen?: boolean
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    const element = dialog.current!
    const previous = document.activeElement
    element.showModal()
    return () => {
      element.close()
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true })
    }
  }, [])
  return <dialog ref={dialog} aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); onClose() }}
    className={`fixed inset-0 m-auto overflow-auto border border-line bg-panel text-ink backdrop:bg-ink/40 ${fullScreen
      ? 'h-dvh max-h-none w-dvw max-w-none' : 'max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-3xl rounded'}`}>
    <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
      <h2 id={titleId} className="text-lg font-bold">{title}</h2>
      <button type="button" onClick={onClose}
        className="rounded border border-line bg-panel px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">Close</button>
    </div>
    {children}
  </dialog>
}
