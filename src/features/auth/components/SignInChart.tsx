import { useMemo } from 'react'
import { ChartMap } from '../../../components/chart'
import { useSurveillanceData } from '../../../lib/useSurveillanceData'

const layers = { zones: true, tracks: false, detections: false }
const alerts: [] = []
export function SignInChart() {
  const query = useSurveillanceData()
  const data = useMemo(() => query.data ? { ...query.data.chart, drones: [], places: [], zoneLabels: [] } : null, [query.data])
  return <section aria-label="Coastal chart overview" className="relative hidden min-h-[560px] overflow-hidden bg-shoal lg:block">
    {data && <ChartMap data={data} layers={layers} alerts={alerts} />}
    {query.isError && <p role="alert" className="absolute top-4 left-4 rounded bg-panel p-3 text-sm">
      Could not load chart. <button type="button" onClick={() => void query.refetch()}
        className="underline focus-visible:outline-2 focus-visible:outline-sea">Try again</button>
    </p>}
    <div className="absolute bottom-10 left-10 mr-10 max-w-md rounded bg-panel/95 p-5">
      <h2 className="text-3xl font-bold leading-tight">One watch floor for every drone on the coast.</h2>
      <p className="mt-2 text-mute">Live video, AI detections and chart positions, kept together and kept on the record.</p>
    </div>
  </section>
}
