import { useEffect, useMemo } from 'react'
import type { Map } from 'maplibre-gl'
import { ChartMap, type ChartData } from '../../../components/chart'
import { useSurveillanceData } from '../../../lib/useSurveillanceData'
import { zoneFeatures, useZoneCorners } from '../hooks/useZoneCorners'
import type { useZoneDrawing } from '../hooks/useZoneDrawing'
import { useZonesRulesStore } from '../store/useZonesRulesStore'
import type { Zone } from '../types'

const layers = { zones: true, tracks: true, detections: true }
const alerts: [] = []
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'
interface Props {
  zones: Zone[]; zone: Zone; map: Map | null; onReady: (map: Map | null) => void
  drawing: ReturnType<typeof useZoneDrawing>
}
export function ZoneMap({ zones, zone, map, onReady, drawing }: Props) {
  const query = useSurveillanceData()
  const data = useMemo<ChartData | null>(() => query.data ? ({
    ...query.data.chart,
    zones: zoneFeatures(zones), zoneLabels: zones.map((item) => ({
      id: item.id, name: item.name, tone: item.tone,
      position: [Math.max(...item.points.map(([lng]) => lng)), Math.max(...item.points.map(([, lat]) => lat))],
    })),
  }) : null, [zones, query.data])
  useZoneCorners(map, zone, !drawing.drawing)
  const selectedId = zone.id
  useEffect(() => {
    if (!map) return
    const selected = useZonesRulesStore.getState().zones.find((item) => item.id === selectedId)!
    const lngs = selected.points.map(([lng]) => lng), lats = selected.points.map(([, lat]) => lat)
    map.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], {
      padding: { top: 100, bottom: 90, left: 50, right: 50 }, maxZoom: 13,
      duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500,
    })
    map.setPaintProperty('zone-outline', 'line-width', ['case', ['==', ['get', 'id'], selectedId], 3, 1.5])
    map.setPaintProperty('zone-fill', 'fill-opacity', 0.12)
  }, [map, selectedId])
  return <section aria-label="Zone editing chart" className="relative min-h-[560px] border-b border-line bg-shoal xl:border-r xl:border-b-0">
    {data && <ChartMap data={data} layers={layers} alerts={alerts} onReady={onReady} />}
    {query.isError && <p role="alert" className="absolute top-16 left-3 rounded bg-panel p-3 text-sm">
      Could not load the chart. <button type="button" onClick={() => void query.refetch()}
        className={`underline ${focus}`}>Try again</button>
    </p>}
    <div className="absolute inset-x-3 top-3 w-fit max-w-[calc(100%_-_1.5rem)] rounded border border-line bg-panel px-3 py-1.5 text-xs">
      {drawing.drawing ? 'Click points on the chart. Double-click to finish.' : `Editing ${zone.id}. Drag corners to reshape.`}
    </div>
    {drawing.drawing && <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 border border-sea bg-panel" />}
    <div className="absolute inset-x-3 bottom-3 rounded border border-line bg-panel p-3 text-xs">
      {drawing.drawing ? <>
        <p>Keyboard: arrow keys pan, Space adds a point at the centre, Enter finishes, Escape cancels.</p>
        <p role="status" className="mt-1 text-mute">{drawing.points.length} points placed</p>
        {drawing.error && <p role="alert" className="mt-1 text-red">{drawing.error}</p>}
        <div className="mt-2 flex flex-wrap gap-3 font-semibold">
          <button type="button" onClick={drawing.finish} className={`rounded bg-sea px-3 py-1.5 text-panel ${focus}`}>Finish zone</button>
          <button type="button" onClick={drawing.undo} disabled={!drawing.points.length}
            className={`rounded border border-line px-3 py-1.5 disabled:opacity-50 ${focus}`}>Undo point</button>
          <button type="button" onClick={drawing.cancel} className={`rounded border border-line px-3 py-1.5 ${focus}`}>Cancel drawing</button>
        </div>
      </> : <p className="text-mute">{zone.type}. Focus a corner and use arrow keys to reshape; hold Shift for larger steps.</p>}
    </div>
  </section>
}
