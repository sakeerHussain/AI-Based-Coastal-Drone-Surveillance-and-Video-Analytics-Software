import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useIncidentsStore } from '../store/useIncidentsStore'
import type { IncidentsData } from '../types'

export function useIncidentsData() {
  const hydrate = useIncidentsStore((state) => state.hydrate)
  const loaded = useIncidentsStore((state) => state.loaded)
  const query = useQuery({
    queryKey: ['incidents'], staleTime: Infinity,
    queryFn: async ({ signal }): Promise<IncidentsData> => {
      const response = await fetch('/api/incidents', { signal })
      if (!response.ok) throw new Error('Could not load incidents.')
      return response.json()
    },
  })
  useEffect(() => { if (query.data) hydrate(query.data) }, [query.data, hydrate])
  return { ...query, ready: loaded && !!query.data }
}
