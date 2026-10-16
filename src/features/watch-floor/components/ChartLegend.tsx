export function ChartLegend() {
  return (
    <div className="absolute bottom-3 left-3 flex flex-wrap gap-4 rounded border border-line bg-panel px-3 py-2 text-xs" aria-label="Chart legend">
      <span><span aria-hidden="true" className="mr-1 inline-block h-2 w-2 rounded-full bg-red" />Alert</span>
      <span><span aria-hidden="true" className="mr-1 inline-block h-2 w-2 rounded-full bg-amber" />Crowd</span>
      <span><span aria-hidden="true" className="mr-1 inline-block h-2 w-2 rounded-full bg-green" />Vessel, normal</span>
    </div>
  )
}
