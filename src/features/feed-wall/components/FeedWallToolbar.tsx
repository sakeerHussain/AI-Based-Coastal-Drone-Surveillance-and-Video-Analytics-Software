import type { FeedLayout } from '../types'

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'
interface Props {
  layout: FeedLayout; onLayout: (layout: FeedLayout) => void
  showing: number; total: number; capacity: number; page: number; pages: number
  onPage: (page: number) => void
}
export function FeedWallToolbar({ layout, onLayout, showing, total, capacity, page, pages, onPage }: Props) {
  return <header className="flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-3">
    <div>
      <h1 className="text-xl font-bold tracking-tight">Feed wall</h1>
      <p className="mt-0.5 text-xs text-mute" role="status">Showing {showing} of {total} live feeds · Capacity {capacity}, expandable</p>
    </div>
    <div className="flex flex-wrap items-center gap-3">
    <div className="flex gap-1 rounded border border-line bg-panel p-1 text-xs" role="group" aria-label="Feed grid layout">
      {([3, 2, 1] as const).map((size) => <button key={size} type="button" aria-pressed={layout === size}
        onClick={() => onLayout(size)}
        className={`rounded-sm px-3 py-1.5 font-semibold ${focus} ${layout === size ? 'bg-sea text-panel' : 'text-mute hover:bg-paper hover:text-ink'}`}>
        {size} by {size}
      </button>)}
    </div>
    {pages > 1 && <nav aria-label="Feed pages" className="flex items-center gap-2 text-xs">
      <button type="button" disabled={page === 0} onClick={() => onPage(page - 1)}
        className={`rounded border border-line bg-panel px-2.5 py-2 disabled:opacity-40 ${focus}`}>Previous</button>
      <span aria-live="polite" className="min-w-10 text-center text-mute">{page + 1} / {pages}</span>
      <button type="button" disabled={page === pages - 1} onClick={() => onPage(page + 1)}
        className={`rounded border border-line bg-panel px-2.5 py-2 disabled:opacity-40 ${focus}`}>Next</button>
    </nav>}
    </div>
  </header>
}
