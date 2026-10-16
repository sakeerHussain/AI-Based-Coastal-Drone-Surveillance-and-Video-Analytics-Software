import { useQuery } from '@tanstack/react-query'
import type { FeedWallData } from '../types'

export function useFeeds() {
  return useQuery({
    queryKey: ['feeds'], staleTime: Infinity,
    queryFn: async ({ signal }): Promise<FeedWallData> => {
      const response = await fetch('/api/feeds', { signal })
      if (!response.ok) throw new Error('Could not load live feeds.')
      return response.json()
    },
  })
}
