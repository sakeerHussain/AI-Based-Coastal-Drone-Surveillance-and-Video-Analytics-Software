import { lazy, Suspense, useState } from 'react'
import { useLiveData } from '../../../hooks/useLiveData'
import { useFeeds } from '../api/feeds'
import type { Feed } from '../types'
import { useFeedWallStore } from '../store/useFeedWallStore'
import { FeedWallToolbar } from './FeedWallToolbar'
import { FeedTile } from './FeedTile'
import { FeedDialog } from './FeedDialog'
import { FeedWallSummary } from './FeedWallSummary'
import { FeedWallStatusPanel } from './FeedWallStatusPanel'

const FeedWallCharts = lazy(() => import('./FeedWallCharts'))
const columns = { 3: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3', 2: 'grid-cols-1 sm:grid-cols-2', 1: 'grid-cols-1' }
const rows = { 3: 'xl:grid-rows-3', 2: 'xl:grid-rows-2', 1: 'xl:grid-rows-1' }
export function FeedWallPage() {
  const query = useFeeds()
  const layout = useFeedWallStore((state) => state.layout)
  const page = useFeedWallStore((state) => state.page)
  const setLayout = useFeedWallStore((state) => state.setLayout)
  const setPage = useFeedWallStore((state) => state.setPage)
  const [selected, setSelected] = useState<Feed | null>(null)
  useLiveData()
  if (query.isPending) return <p role="status" className="p-4 text-sm text-mute">Loading live feeds…</p>
  if (query.isError) return <div role="alert" className="p-4 text-sm">
    <p>Could not load live feeds.</p>
    <button type="button" onClick={() => void query.refetch()}
      className="mt-3 rounded border border-line bg-panel px-3 py-2 focus-visible:outline-2 focus-visible:outline-sea">Try again</button>
  </div>
  const { feeds, capacity } = query.data
  const size = layout * layout
  const visible = feeds.slice(page * size, (page + 1) * size)
  return <div className="flex min-h-full flex-col gap-3 p-4 xl:h-full">
    <FeedWallToolbar layout={layout} onLayout={setLayout}
      showing={visible.length} total={feeds.length} capacity={capacity} page={page}
      pages={Math.ceil(feeds.length / size)} onPage={setPage} />
    <FeedWallSummary total={feeds.length} capacity={capacity}
      linked={feeds.filter((feed) => feed.incidentId).length} />
    <div className="grid min-h-[420px] flex-1 gap-3 xl:grid-cols-[minmax(0,1fr)_240px] 2xl:grid-cols-[minmax(0,1fr)_272px]">
      <section aria-label="Live feeds" className="flex min-h-0 min-w-0 flex-col rounded border border-line bg-shoal/30 p-2">
        <div className={`grid min-h-[380px] flex-1 gap-2 ${columns[layout]} ${rows[layout]}`}>
          {visible.map((feed) => <FeedTile key={feed.id} feed={feed} onOpen={() => setSelected(feed)} />)}
        </div>
        <div className="flex flex-wrap justify-between gap-2 px-1 pt-2 text-[11px] text-mute">
          <span>Select a feed to inspect video and telemetry</span>
          <span>Page {page + 1} of {Math.ceil(feeds.length / size)}</span>
        </div>
      </section>
      <FeedWallStatusPanel feeds={feeds} />
    </div>
    <Suspense fallback={<p role="status" className="min-h-[224px] shrink-0 rounded border border-line bg-panel p-4 text-sm text-mute">Loading feed analytics…</p>}>
      <FeedWallCharts feeds={feeds} />
    </Suspense>
    {selected && <FeedDialog feed={selected} onClose={() => setSelected(null)} />}
  </div>
}
