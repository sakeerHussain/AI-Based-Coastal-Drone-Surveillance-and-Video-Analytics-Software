import { useAuthStore, type AuthUser } from '../../features/auth'
import { useWatchFloorStore } from '../../features/watch-floor'
import { useIncidentsStore } from '../../features/incidents'
import { useZonesRulesStore } from '../../features/zones-rules'
import { useModelsStore } from '../../features/models'
import { useFeedWallStore } from '../../features/feed-wall'
import { useAuditStore } from '../../lib/useAuditStore'
import { useLiveDataStore } from '../../lib/useLiveDataStore'
import { queryClient, useDemoStore } from '../../lib/useDemoStore'
import { liveDataClient } from '../../lib/liveDataClient'
import { can } from '../../lib/permissions'

export function resetDemo(user: AuthUser | null): boolean {
  if (!can(user, 'demo:reset')) return false
  liveDataClient.reset()
  useWatchFloorStore.getState().reset()
  useIncidentsStore.getState().reset()
  useZonesRulesStore.getState().reset()
  useModelsStore.getState().reset()
  useFeedWallStore.getState().reset()
  useAuditStore.getState().reset()
  useLiveDataStore.getState().reset()
  useAuthStore.getState().reset()
  queryClient.clear()
  useDemoStore.getState().reset()
  return true
}
