import { useLiveDataStore } from '../../../lib/useLiveDataStore'
import type { Feed } from '../types'

export function FeedWallStatusPanel({ feeds }: { feeds: Feed[] }) {
  const health = useLiveDataStore((state) => state.health)
  const linked = feeds.filter((feed) => feed.incidentId)
  return <aside aria-label="Feed wall status" className="grid content-start gap-3 md:grid-cols-2 xl:grid-cols-1">
    <section className="overflow-hidden rounded border border-line bg-panel" aria-labelledby="feed-incidents-title">
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-3">
        <h2 id="feed-incidents-title" className="text-sm font-semibold">Linked incidents</h2>
        <span className="rounded bg-paper px-2 py-0.5 text-xs font-semibold">{linked.length}</span>
      </div>
      <div className="p-3">
        <p className="text-[11px] leading-relaxed text-mute">Open a marked feed to review its incident.</p>
        {linked.length ? <ul className="mt-3 space-y-3">
          {linked.map((feed) => <li key={feed.id} className="border-l-2 border-red bg-paper px-3 py-2">
            <p className="text-xs font-semibold">{feed.title}</p>
            <p className="mt-1 text-[11px] text-mute">1 linked incident</p>
          </li>)}
        </ul> : <p className="mt-3 text-xs text-mute">No linked incidents.</p>}
      </div>
    </section>
    <section className="rounded border border-line bg-panel" aria-labelledby="feed-health-title">
      <h2 id="feed-health-title" className="border-b border-line px-3 py-3 text-sm font-semibold">System details</h2>
      {!health ? <p role="status" className="p-3 text-xs text-mute">Waiting for health data…</p> : <div className="p-3">
        <dl className="space-y-3 text-[11px]">
          <div className="flex justify-between gap-2"><dt className="text-mute">Inference delay</dt><dd className="font-semibold">{health.inferenceDelay} ms</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-mute">Uptime, 30 days</dt><dd className="font-semibold">{health.uptime.toFixed(2)}%</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-mute">Last backup</dt><dd className="font-semibold">{health.lastBackup}</dd></div>
        </dl>
      </div>}
    </section>
  </aside>
}
