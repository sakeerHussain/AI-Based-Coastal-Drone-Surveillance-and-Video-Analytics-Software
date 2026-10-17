import { lazy, Suspense, useEffect, useState } from 'react'
import { useLiveData } from '../../../hooks/useLiveData'
import { useModels } from '../api/models'
import { useModelsStore } from '../store/useModelsStore'
import { ModelRegistry } from './ModelRegistry'
import { ModelActions } from './ModelActions'
import { CompareModelsDialog } from './CompareModelsDialog'
import { DatasetRequests } from './DatasetRequests'
import { SystemHealthPanel } from './SystemHealthPanel'
import { AuditList } from './AuditList'
import { ModelToast } from './ModelToast'
import { ModelsHealthSummary } from './ModelsHealthSummary'

const ModelsHealthCharts = lazy(() => import('./ModelsHealthCharts'))

export function ModelsAndHealthPage() {
  const query = useModels()
  const models = useModelsStore((state) => state.models)
  const selectedId = useModelsStore((state) => state.selectedId)
  const select = useModelsStore((state) => state.select)
  const hydrate = useModelsStore((state) => state.hydrate)
  const [comparing, setComparing] = useState(false)
  useLiveData()
  useEffect(() => { if (query.data) hydrate(query.data) }, [query.data, hydrate])
  if (query.isPending) return <p role="status" className="p-4 text-sm text-mute">Loading model registry…</p>
  if (query.isError) return <div role="alert" className="p-4 text-sm">
    <p>Could not load model registry.</p>
    <button type="button" onClick={() => void query.refetch()}
      className="mt-3 rounded border border-line bg-panel px-3 py-2 focus-visible:outline-2 focus-visible:outline-sea">Try again</button>
  </div>
  return <>
    <div className="flex min-h-full flex-col gap-3 p-4">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-bold tracking-tight">Models and health</h1>
        <p className="text-xs text-mute">Model governance and system monitoring</p>
      </header>
      <ModelsHealthSummary annotatedFrames={query.data.dataset.annotatedFrames} />
      <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0 rounded border border-line bg-panel p-4" aria-label="Model registry and actions">
          <h2 className="text-lg font-bold">Model registry</h2>
          <p className="text-sm text-mute">Nothing goes live without sign-off from the designated authority.</p>
          <ModelRegistry models={models} selectedId={selectedId} onSelect={select} />
          <ModelActions model={models.find((model) => model.id === selectedId)} onCompare={() => setComparing(true)} />
        </section>
        <SystemHealthPanel />
      </div>
      <Suspense fallback={<p role="status" className="min-h-[232px] rounded border border-line bg-panel p-4 text-sm text-mute">Loading model and health analytics…</p>}>
        <ModelsHealthCharts />
      </Suspense>
      <div className="grid items-start gap-3 xl:grid-cols-2">
        <div className="min-w-0 rounded border border-line bg-panel px-4 pb-4 [&>section]:mt-4">
          <DatasetRequests dataset={query.data.dataset} />
        </div>
        <div className="min-w-0 rounded border border-line bg-panel px-4 pb-4 [&>section]:mt-4 [&>section]:border-t-0 [&>section]:pt-0">
          <AuditList />
        </div>
      </div>
    </div>
    {comparing && <CompareModelsDialog versions={query.data.versions} defaults={query.data.comparisonDefaults} onClose={() => setComparing(false)} />}
    <ModelToast />
  </>
}
