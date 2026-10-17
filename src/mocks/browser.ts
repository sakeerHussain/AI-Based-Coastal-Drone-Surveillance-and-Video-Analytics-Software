import { setupWorker } from 'msw/browser'
import { zonesRulesHandlers } from './zones-rules/handlers'
import { feedWallHandlers } from './feed-wall/handlers'
import { modelsHandlers } from './models/handlers'
import { surveillanceHandlers } from './watch-floor/handlers'
import { incidentsHandlers } from './incidents/handlers'
import { adminHandlers } from './admin/handlers'
import { sourcesHandlers } from './video-sources/handlers'
import { fleetHandlers } from './fleet/handlers'
import { datasetsHandlers } from './datasets/handlers'

const worker = setupWorker(...zonesRulesHandlers, ...feedWallHandlers, ...modelsHandlers, ...surveillanceHandlers, ...incidentsHandlers, ...adminHandlers, ...sourcesHandlers, ...fleetHandlers, ...datasetsHandlers)
export async function startMocks() {
  await worker.start({ onUnhandledFrame: 'bypass', quiet: true })
}
