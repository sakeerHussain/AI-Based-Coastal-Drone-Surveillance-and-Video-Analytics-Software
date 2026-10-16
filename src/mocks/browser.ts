import { setupWorker } from 'msw/browser'
import { zonesRulesHandlers } from './zones-rules/handlers'

const worker = setupWorker(...zonesRulesHandlers)
export async function startMocks() {
  await worker.start({ onUnhandledFrame: 'bypass', quiet: true })
}
