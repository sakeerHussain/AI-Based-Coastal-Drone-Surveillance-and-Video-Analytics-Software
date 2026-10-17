import { useQuery } from '@tanstack/react-query'
import type { SourcesData } from '../types'

export function useSourcesData() {
  return useQuery({
    queryKey: ['video-sources'], staleTime: Infinity,
    queryFn: async ({ signal }): Promise<SourcesData> => {
      const response = await fetch('/api/video-sources', { signal })
      if (!response.ok) throw new Error('Could not load video sources.')
      return response.json()
    },
  })
}
