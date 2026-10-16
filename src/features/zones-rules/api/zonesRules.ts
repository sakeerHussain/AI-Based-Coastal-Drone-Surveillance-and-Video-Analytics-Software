import { useQuery } from '@tanstack/react-query'
import type { ZonesRulesData } from '../types'

export function useZonesRulesData() {
  return useQuery({
    queryKey: ['zones-rules'],
    queryFn: async ({ signal }): Promise<ZonesRulesData> => {
      const response = await fetch('/api/zones-rules', { signal })
      if (!response.ok) throw new Error('Zones could not be loaded. Try again.')
      return response.json()
    },
    staleTime: Infinity,
  })
}
