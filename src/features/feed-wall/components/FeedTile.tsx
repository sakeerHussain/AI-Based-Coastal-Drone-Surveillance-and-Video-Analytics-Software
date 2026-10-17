import { SceneFrame } from '../../../components/SceneFrame'
import type { Feed } from '../types'

export function FeedTile({ feed, onOpen }: { feed: Feed; onOpen: () => void }) {
  return <button type="button" onClick={onOpen} aria-label={`Open ${feed.title}${feed.incidentId ? ', 1 alert' : ''}`}
    className="group flex min-h-0 min-w-0 flex-col overflow-hidden rounded-sm border border-line bg-panel text-left hover:border-sea focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">
    <div className="flex w-full shrink-0 items-center justify-between gap-2 px-2.5 py-2 text-[11px]">
      <span className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 font-bold">{feed.id}</span>
        <span className="truncate border-l border-line pl-2 text-mute">{feed.title.slice(feed.id.length).trim()}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5 text-green">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-green" />Live
      </span>
    </div>
    <div className="relative aspect-video w-full overflow-hidden bg-ink xl:aspect-auto xl:min-h-0 xl:flex-1">
      <svg viewBox="0 0 320 180" className="h-full w-full" role="img" aria-label={feed.scene.description}>
        <g aria-hidden="true"><SceneFrame scene={feed.scene} /></g>
      </svg>
      {feed.incidentId && <span className="absolute top-2 left-2 border-l-2 border-red bg-panel px-2 py-0.5 text-[11px] font-semibold text-ink">1 alert</span>}
    </div>
    <div className="flex w-full shrink-0 items-center justify-between gap-2 border-t border-line px-2.5 py-1.5 text-[10px] text-mute">
      <span>{feed.resolution}, {feed.frameRate} fps</span>
      <span className="font-medium text-sea group-hover:underline">View feed</span>
    </div>
  </button>
}
