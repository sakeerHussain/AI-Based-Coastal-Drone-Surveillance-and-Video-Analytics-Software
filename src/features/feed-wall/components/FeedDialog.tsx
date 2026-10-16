import { Link } from 'react-router-dom'
import { Dialog } from '../../../components/Dialog'
import { SceneFrame } from '../../../components/SceneFrame'
import { TelemetryStrip } from '../../../components/TelemetryStrip'
import { useLiveDataStore } from '../../../lib/useLiveDataStore'
import type { Feed } from '../types'

export function FeedDialog({ feed, onClose }: { feed: Feed; onClose: () => void }) {
  const telemetry = useLiveDataStore((state) => state.telemetry[feed.id])
  return <Dialog title={`${feed.title}, live`} onClose={onClose} fullScreen>
    <div className="flex h-[calc(100dvh_-_4.5rem)] min-h-[360px] flex-col">
      <div className="min-h-0 flex-1 overflow-hidden bg-ink"><SceneFrame scene={feed.scene} /></div>
      <TelemetryStrip telemetry={telemetry ?? feed.telemetry} />
      {feed.incidentId && <div className="flex shrink-0 items-center justify-between gap-3 p-4 text-sm">
        <span className="border-l-4 border-red pl-3 font-semibold">1 alert on this feed</span>
        <Link to={`/incidents/${feed.incidentId}`}
          className="rounded bg-sea px-4 py-2 font-semibold text-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">Open incident</Link>
      </div>}
    </div>
  </Dialog>
}
