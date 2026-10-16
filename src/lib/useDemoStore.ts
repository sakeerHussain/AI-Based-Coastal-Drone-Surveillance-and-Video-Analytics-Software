import { create } from 'zustand'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()
interface DemoState {
  enabled: boolean
  step: number
  revision: number
  notice: string
  setEnabled: (enabled: boolean) => void
  setStep: (step: number) => void
  setNotice: (notice: string) => void
  reset: () => void
}
export const useDemoStore = create<DemoState>((set) => ({
  enabled: false, step: 0, revision: 0, notice: '',
  setEnabled: (enabled) => set({ enabled, notice: '' }),
  setStep: (step) => set({ step, notice: '' }),
  setNotice: (notice) => set({ notice }),
  reset: () => set((state) => ({ enabled: false, step: 0, notice: '', revision: state.revision + 1 })),
}))
