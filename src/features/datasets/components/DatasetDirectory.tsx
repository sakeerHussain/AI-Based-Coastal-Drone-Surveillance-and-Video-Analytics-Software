import { useState } from 'react'
import type { DatasetRecord } from '../types'
export function DatasetDirectory({ datasets, selectedId, onSelect }: { datasets: DatasetRecord[]; selectedId: string; onSelect: (id: string) => void }) {
  const [search, setSearch] = useState('')
  const filtered = datasets.filter((item) => `${item.name} ${item.source}`.toLowerCase().includes(search.toLowerCase()))
  return <section className="rounded border border-line bg-panel p-4" aria-label="Dataset directory">
    <h2 className="text-sm font-semibold">Dataset library</h2>
    <label className="mt-3 block text-xs text-mute">Search datasets<input value={search} onChange={(event) => setSearch(event.target.value)}
      className="mt-1 w-full rounded border border-line bg-panel px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-sea" /></label>
    <ul className="mt-3 max-h-96 overflow-auto divide-y divide-line">{filtered.map((item) => <li key={item.id}>
      <button type="button" aria-pressed={selectedId === item.id} onClick={() => onSelect(item.id)}
        className={`w-full border-l-2 p-3 text-left focus-visible:outline-2 focus-visible:outline-sea ${selectedId === item.id ? 'border-sea bg-shoal/40' : 'border-transparent'}`}>
        <span className="block break-words text-sm font-semibold">{item.name}</span>
        <span className="mt-1 block text-xs text-mute">{item.frameCount.toLocaleString('en-GB')} frames · {item.versions.length} versions</span>
        <span className="mt-1 block text-xs text-mute">{item.source}</span>
      </button>
    </li>)}</ul>
    {!filtered.length && <p className="py-4 text-sm text-mute">No datasets match your search.</p>}
  </section>
}
