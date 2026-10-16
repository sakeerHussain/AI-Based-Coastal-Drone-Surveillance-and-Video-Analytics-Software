import { useQuery } from '@tanstack/react-query'
import type { SurveillanceData } from './surveillanceDataTypes'

export function useSurveillanceData() {
  return useQuery({
    queryKey: ['surveillance'], staleTime: Infinity,
    queryFn: async ({ signal }): Promise<SurveillanceData> => {
      const response = await fetch('/api/surveillance', { signal })
      if (!response.ok) throw new Error('Could not load surveillance data.')
      return response.json()
    },
  })
}
