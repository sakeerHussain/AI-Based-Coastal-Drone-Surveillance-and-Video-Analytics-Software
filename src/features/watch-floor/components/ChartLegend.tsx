export function ChartLegend() {
  return (
    <div className="pointer-events-none absolute bottom-3 left-3 flex max-w-[calc(100%_-_1.5rem)] flex-wrap items-center gap-x-4 gap-y-1 rounded border border-line bg-panel px-3 py-2 text-[11px]" aria-label="Chart legend">
      <span><span aria-hidden="true" className="mr-1 inline-block h-2 w-2 rounded-full bg-red" />Alert</span>
      <span><span aria-hidden="true" className="mr-1 inline-block h-2 w-2 rounded-full bg-amber" />Crowd</span>
      <span><span aria-hidden="true" className="mr-1 inline-block h-2 w-2 rounded-full bg-green" />Vessel, normal</span>
    </div>
  )
}
