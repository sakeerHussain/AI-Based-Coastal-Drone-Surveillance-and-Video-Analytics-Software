import type { FeedLayout } from '../types'

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'
interface Props {
  layout: FeedLayout; onLayout: (layout: FeedLayout) => void
  showing: number; total: number; capacity: number; page: number; pages: number
  onPage: (page: number) => void
}
export function FeedWallToolbar({ layout, onLayout, showing, total, capacity, page, pages, onPage }: Props) {
  return <header className="mb-3 flex flex-wrap items-center gap-3">
    <h2 className="text-lg font-bold">Feed wall</h2>
    <p className="text-sm text-mute" role="status">Showing {showing} of {total} live feeds. Capacity {capacity}, expandable.</p>
    <div className="ml-auto flex flex-wrap gap-1 text-sm" role="group" aria-label="Feed grid layout">
      {([3, 2, 1] as const).map((size) => <button key={size} type="button" aria-pressed={layout === size}
        onClick={() => onLayout(size)}
        className={`rounded border border-line px-3 py-1 ${focus} ${layout === size ? 'bg-ink text-paper' : 'bg-panel'}`}>
        {size} by {size}
      </button>)}
    </div>
    {pages > 1 && <nav aria-label="Feed pages" className="flex w-full items-center justify-end gap-3 text-sm">
      <button type="button" disabled={page === 0} onClick={() => onPage(page - 1)}
        className={`rounded border border-line bg-panel px-3 py-1 disabled:opacity-50 ${focus}`}>Previous</button>
      <span aria-live="polite">Page {page + 1} of {pages}</span>
      <button type="button" disabled={page === pages - 1} onClick={() => onPage(page + 1)}
        className={`rounded border border-line bg-panel px-3 py-1 disabled:opacity-50 ${focus}`}>Next</button>
    </nav>}
  </header>
}
