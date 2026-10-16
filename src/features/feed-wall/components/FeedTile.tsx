import { SceneFrame } from '../../../components/SceneFrame'
import type { Feed } from '../types'

export function FeedTile({ feed, onOpen }: { feed: Feed; onOpen: () => void }) {
  return <button type="button" onClick={onOpen} aria-label={`Open ${feed.title}${feed.incidentId ? ', 1 alert' : ''}`}
    className="min-w-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">
    <div className="relative aspect-video overflow-hidden rounded-sm">
      <SceneFrame scene={feed.scene} />
      <span className="absolute top-2 left-2 max-w-[75%] rounded bg-ink/80 px-2 py-0.5 text-[11px] font-semibold text-panel">{feed.title}</span>
      {feed.incidentId && <span className="absolute top-2 right-2 rounded bg-red px-2 py-0.5 text-[11px] font-bold text-panel">1 alert</span>}
    </div>
  </button>
}
