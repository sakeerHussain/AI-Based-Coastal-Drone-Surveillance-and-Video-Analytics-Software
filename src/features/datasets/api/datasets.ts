import { useQuery } from '@tanstack/react-query'
import type { DatasetsData } from '../types'
export function useDatasets() {
  return useQuery({ queryKey: ['datasets'], staleTime: Infinity, queryFn: async ({ signal }): Promise<DatasetsData> => {
    const response = await fetch('/api/datasets', { signal })
    if (!response.ok) throw new Error('Could not load datasets.')
    return response.json()
  } })
}
