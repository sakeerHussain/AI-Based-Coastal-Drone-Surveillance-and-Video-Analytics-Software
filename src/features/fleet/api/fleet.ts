import { useQuery } from '@tanstack/react-query'
import type { FleetData } from '../types'

export function useFleetData() {
  return useQuery({
    queryKey: ['fleet'], staleTime: Infinity,
    queryFn: async ({ signal }): Promise<FleetData> => {
      const response = await fetch('/api/fleet', { signal })
      if (!response.ok) throw new Error('Could not load fleet data.')
      return response.json()
    },
  })
}
