import { setupWorker } from 'msw/browser'
import { zonesRulesHandlers } from './zones-rules/handlers'
import { feedWallHandlers } from './feed-wall/handlers'
import { modelsHandlers } from './models/handlers'

const worker = setupWorker(...zonesRulesHandlers, ...feedWallHandlers, ...modelsHandlers)
export async function startMocks() {
  await worker.start({ onUnhandledFrame: 'bypass', quiet: true })
}
