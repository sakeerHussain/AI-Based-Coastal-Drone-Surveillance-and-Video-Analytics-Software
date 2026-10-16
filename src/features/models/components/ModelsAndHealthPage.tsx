import { useEffect, useState } from 'react'
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
    <div className="grid gap-6 p-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="min-w-0">
        <h2 className="text-lg font-bold">Model registry</h2>
        <p className="text-sm text-mute">Nothing goes live without sign-off from the designated authority.</p>
        <ModelRegistry models={models} selectedId={selectedId} onSelect={select} />
        <ModelActions model={models.find((model) => model.id === selectedId)} onCompare={() => setComparing(true)} />
        <DatasetRequests dataset={query.data.dataset} />
        <AuditList />
      </section>
      <SystemHealthPanel />
    </div>
    {comparing && <CompareModelsDialog versions={query.data.versions} defaults={query.data.comparisonDefaults} onClose={() => setComparing(false)} />}
    <ModelToast />
  </>
}
