import type { SourcesData } from '../../features/video-sources'
import { feedFixtures } from '../feed-wall/feeds'
import { appLoadedAt } from '../../lib/time'

export const sourceDemoSettings = {
  testDelayMs: 800, importStepMs: 400, importStepPercent: 20,
  maxImportBytes: 2 * 1024 * 1024 * 1024,
  extensions: ['mp4', 'mov', 'avi', 'mkv'],
}
export const sourcesData: SourcesData = {
  drones: feedFixtures.map((feed) => ({ id: feed.id, location: feed.title.slice(feed.id.length + 1) })),
  sources: feedFixtures.map((feed, index) => ({
    id: `source-${feed.id}`, name: feed.title, droneId: feed.id, protocol: 'RTSP',
    endpoint: `rtsp://${feed.id.toLowerCase()}.demo.invalid/live`, enabled: true,
    status: 'Connected', lastTested: appLoadedAt, feedIndex: index,
  })),
}
