import { useQuery } from '@tanstack/react-query'
import type { AdminData } from '../types'

export function useAdminData() {
  return useQuery({
    queryKey: ['admin-users'], staleTime: Infinity,
    queryFn: async ({ signal }): Promise<AdminData> => {
      const response = await fetch('/api/admin/users', { signal })
      if (!response.ok) throw new Error('Could not load the user directory.')
      return response.json()
    },
  })
}
