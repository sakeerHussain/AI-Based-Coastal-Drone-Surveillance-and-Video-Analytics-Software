import { useLiveDataStore } from '../../../lib/useLiveDataStore'
import { useModelsStore } from '../store/useModelsStore'

export function ModelsHealthSummary({ annotatedFrames }: { annotatedFrames: number }) {
  const models = useModelsStore((state) => state.models)
  const loaded = useModelsStore((state) => state.loaded)
  const health = useLiveDataStore((state) => state.health)
  const metrics = [
    { label: 'Registered models', value: loaded ? models.length : '—', detail: 'In the current registry', tone: 'border-l-sea' },
    { label: 'Production models', value: loaded ? models.filter((model) => model.stage === 'Production').length : '—', detail: 'Approved for production', tone: 'border-l-green' },
    { label: 'Awaiting approval', value: loaded ? models.filter((model) => model.stage === 'Awaiting approval').length : '—', detail: 'Pending authority sign-off', tone: 'border-l-amber' },
    { label: 'Annotated frames', value: annotatedFrames.toLocaleString('en-GB'), detail: 'From authorised patrols', tone: 'border-l-sea' },
    { label: 'Inference delay', value: health ? `${health.inferenceDelay} ms` : '—', detail: 'Current processing delay', tone: 'border-l-sea' },
  ]
  return <dl aria-label="Models and health overview" className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
    {metrics.map((metric) => <div key={metric.label} className={`rounded border border-line border-l-[3px] bg-panel px-4 py-3 ${metric.tone}`}>
      <dt className="text-xs font-medium text-mute">{metric.label}</dt>
      <dd className="mt-2">
        <span className="block text-[26px] font-bold leading-none tracking-tight">{metric.value}</span>
        <span className="mt-2 block text-[11px] text-mute">{metric.detail}</span>
      </dd>
    </div>)}
  </dl>
}
