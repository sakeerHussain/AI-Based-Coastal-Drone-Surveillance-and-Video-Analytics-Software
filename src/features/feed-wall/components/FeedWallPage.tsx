import { useState } from 'react'
import { useLiveData } from '../../../hooks/useLiveData'
import { useFeeds } from '../api/feeds'
import type { Feed } from '../types'
import { useFeedWallStore } from '../store/useFeedWallStore'
import { FeedWallToolbar } from './FeedWallToolbar'
import { FeedTile } from './FeedTile'
import { FeedDialog } from './FeedDialog'

const columns = { 3: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3', 2: 'grid-cols-1 sm:grid-cols-2', 1: 'grid-cols-1' }
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
  return <div className="p-4">
    <FeedWallToolbar layout={layout} onLayout={setLayout}
      showing={visible.length} total={feeds.length} capacity={capacity} page={page}
      pages={Math.ceil(feeds.length / size)} onPage={setPage} />
    <section aria-label="Live feeds" className={`grid gap-3 ${columns[layout]}`}>
      {visible.map((feed) => <FeedTile key={feed.id} feed={feed} onOpen={() => setSelected(feed)} />)}
    </section>
    {selected && <FeedDialog feed={selected} onClose={() => setSelected(null)} />}
  </div>
}
