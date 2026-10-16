import { useEffect, useState } from 'react'
import type { Map } from 'maplibre-gl'
import { useZonesRulesData } from '../api/zonesRules'
import { useZonesRulesStore } from '../store/useZonesRulesStore'
import { useZoneDrawing } from '../hooks/useZoneDrawing'
import { ZoneList } from './ZoneList'
import { ZoneMap } from './ZoneMap'
import { RuleEditor } from './RuleEditor'
import { NewZoneDialog } from './NewZoneDialog'
import { RuleToast } from './RuleToast'

export function ZonesAndRulesPage() {
  const query = useZonesRulesData()
  const [map, setMap] = useState<Map | null>(null)
  const state = useZonesRulesStore()
  const hydrate = state.hydrate
  const drawing = useZoneDrawing(map)
  useEffect(() => { if (query.data) hydrate(query.data) }, [query.data, hydrate])
  const zone = state.zones.find((item) => item.id === state.selectedId)
  if (query.isError) return <div role="alert" className="p-4 text-sm">
    <p>Zones could not be loaded.</p>
    <button type="button" onClick={() => void query.refetch()}
      className="mt-3 rounded border border-line bg-panel px-3 py-2 focus-visible:outline-2 focus-visible:outline-sea">Try again</button>
  </div>
  if (!zone) return <p role="status" className="p-4 text-sm text-mute">Loading zones and rules…</p>
  return <>
    <div className="grid min-h-[560px] xl:h-full xl:grid-cols-[240px_minmax(0,1fr)_380px]">
      <ZoneList zones={state.zones} selectedId={zone.id} onSelect={state.select}
        drawing={drawing.drawing} ready={!!map} onDraw={drawing.start} />
      <ZoneMap zones={state.zones} zone={zone} map={map} onReady={setMap} drawing={drawing} />
      <RuleEditor key={zone.id} zones={state.zones} zone={zone} rule={state.drafts[zone.id]} />
    </div>
    {drawing.pending && <NewZoneDialog onClose={drawing.closeDialog} onSave={(name, type) => {
      state.addZone(name, type, drawing.pending!); drawing.closeDialog()
    }} />}
    <RuleToast />
  </>
}
