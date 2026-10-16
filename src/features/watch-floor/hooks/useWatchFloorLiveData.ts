import { useEffect } from 'react'
import { liveDataClient } from '../../../lib/liveDataClient'
import { useWatchFloorStore } from '../store/useWatchFloorStore'

export function useWatchFloorLiveData() {
  useEffect(() => {
    const unsubscribe = liveDataClient.subscribe(useWatchFloorStore.getState().receive)
    return () => {
      unsubscribe()
      useWatchFloorStore.getState().dismissToast()
    }
  }, [])
}
