import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Map } from 'maplibre-gl'
import { drones } from '../../../mocks/watch-floor/drones'
import { useWatchFloorStore } from '../store/useWatchFloorStore'

export function useWatchFloorMap(map: Map | null) {
  const [searchParams] = useSearchParams()
  const requestedDroneId = searchParams.get('drone')
  const showTrack = searchParams.get('track') === '1'
  useEffect(() => {
    if (!map) return
    return useWatchFloorStore.subscribe((state, previous) => {
      if (state.selectedDroneId === previous.selectedDroneId) return
      const drone = drones.find((item) => item.id === state.selectedDroneId)
      if (!drone) return
      map.flyTo({
        center: drone.position, duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1_000,
      })
    })
  }, [map])
  useEffect(() => {
    if (!map || !requestedDroneId) return
    const drone = drones.find((item) => item.id === requestedDroneId)
    if (!drone) return
    const state = useWatchFloorStore.getState()
    state.selectDrone(drone.id)
    if (showTrack && !state.layers.tracks) state.toggleLayer('tracks')
    map.stop()
    map.jumpTo({ center: drone.position })
  }, [map, requestedDroneId, showTrack])
}
