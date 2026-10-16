import type { LiveAlert } from '../../lib/liveDataTypes'
import { appLoadedAt } from '../../lib/time'

export const initialAlerts: LiveAlert[] = [
  { id: 'crowd-cherai', severity: 'medium', title: 'Crowd of 62 on Cherai beach (limit 50)',
    droneId: 'KP-D12', createdAt: appLoadedAt - 8 * 60_000, position: [76.178, 10.139] },
  { id: 'jetty-kochi', severity: 'medium', title: 'Stationary object on Fort Kochi jetty, 22 min',
    droneId: 'KP-D03', createdAt: appLoadedAt - 29 * 60_000, position: [76.237, 9.976] },
  { id: 'zone-clear', severity: 'info', title: 'Zone Z-07 clear after vessel departure',
    droneId: 'KP-D03', createdAt: appLoadedAt - 51 * 60_000, position: [76.219, 9.985] },
]
export const highAlert: Omit<LiveAlert, 'createdAt'> = {
  id: 'vessel-z04', severity: 'high', title: 'Unregistered vessel loitering in Z-04',
  droneId: 'KP-D07', position: [76.16, 10.172],
}
