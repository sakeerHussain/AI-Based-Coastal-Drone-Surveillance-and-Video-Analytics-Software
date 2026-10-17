import { useQuery } from '@tanstack/react-query'
import type { ModelsData } from '../types'

export function useModels() {
  return useQuery({
    queryKey: ['models'], staleTime: Infinity,
    queryFn: async ({ signal }): Promise<ModelsData> => {
      const response = await fetch('/api/models', { signal })
      if (!response.ok) throw new Error('Could not load model registry and training configuration.')
      return response.json()
    },
  })
}
