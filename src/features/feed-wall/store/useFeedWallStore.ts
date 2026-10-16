import { create } from 'zustand'
import type { FeedLayout } from '../types'

interface FeedWallState {
  layout: FeedLayout
  page: number
  setLayout: (layout: FeedLayout) => void
  setPage: (page: number) => void
  reset: () => void
}
export const useFeedWallStore = create<FeedWallState>((set) => ({
  layout: 3, page: 0,
  setLayout: (layout) => set({ layout, page: 0 }),
  setPage: (page) => set({ page }),
  reset: () => set({ layout: 3, page: 0 }),
}))
