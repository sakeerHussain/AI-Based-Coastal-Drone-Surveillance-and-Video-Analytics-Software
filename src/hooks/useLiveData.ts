import { useEffect } from 'react'
import { liveDataClient } from '../lib/liveDataClient'
import { useLiveDataStore } from '../lib/useLiveDataStore'

export function useLiveData() {
  useEffect(() => liveDataClient.subscribe(useLiveDataStore.getState().receive), [])
}
