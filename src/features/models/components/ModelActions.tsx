import { can } from '../../../lib/permissions'
import { useAuthStore } from '../../auth'
import { useModelsStore } from '../store/useModelsStore'
import type { ModelRecord } from '../types'

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'
export function ModelActions({ model, onCompare }: { model?: ModelRecord; onCompare: () => void }) {
  const user = useAuthStore((state) => state.user)
  const request = useModelsStore((state) => state.requestPromotion)
  const approve = useModelsStore((state) => state.approve)
  return <div className="mt-5">
    <div className="flex flex-wrap gap-2 text-sm font-semibold">
      <button type="button" onClick={onCompare} className={`rounded border border-line bg-panel px-4 py-2 ${focus}`}>Compare versions</button>
      {can(user, 'models:request-promotion') && <button type="button" onClick={() => request(user)} disabled={model?.stage !== 'Staging'}
        className={`rounded bg-sea px-4 py-2 text-panel disabled:opacity-50 ${focus}`}>Request approval to promote</button>}
      {can(user, 'models:record-approval') && <button type="button" onClick={() => approve(user)} disabled={model?.stage !== 'Awaiting approval'}
        className={`rounded border border-sea bg-panel px-4 py-2 text-sea disabled:opacity-50 ${focus}`}>Record authority approval</button>}
    </div>
    <p className="mt-2 text-xs text-mute" role="status">
      {model ? `Selected: ${model.name} ${model.version}. ${model.stage === 'Staging'
        ? 'Ready to request authority approval.' : model.stage === 'Awaiting approval'
          ? 'Awaiting authority approval. An administrator can record it.' : 'Already in Production.'}` : 'Select a model to act on.'}
    </p>
  </div>
}
