import type { Zone } from '../types'

const tones = { red: 'border-red', amber: 'border-amber', sea: 'border-sea' }
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'
interface Props {
  zones: Zone[]; selectedId: string; drawing: boolean; ready: boolean
  onSelect: (id: string) => void; onDraw: () => void
}
export function ZoneList({ zones, selectedId, drawing, ready, onSelect, onDraw }: Props) {
  return <aside className="border-b border-line bg-panel p-3 text-sm xl:border-r xl:border-b-0">
    <h2 className="mb-2 font-semibold">Zones</h2>
    {zones.map((zone) => <button key={zone.id} type="button" onClick={() => onSelect(zone.id)}
      disabled={drawing} aria-pressed={selectedId === zone.id}
      className={`w-full border-l-4 px-3 py-2 text-left disabled:opacity-50 ${tones[zone.tone]} ${focus} ${selectedId === zone.id ? 'bg-shoal' : ''}`}>
      <span className="font-semibold">{zone.id}</span> {zone.name}
    </button>)}
    <button type="button" disabled={!ready || drawing} onClick={onDraw}
      className={`mt-3 w-full rounded border border-dashed border-line py-2 font-semibold text-sea disabled:opacity-50 ${focus}`}>
      Draw new zone
    </button>
  </aside>
}
