import { useEffect, useRef, useState } from 'react'
import { Map, setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import { chartBounds } from '../../../mocks/watch-floor/chart'
import { chartStyle } from '../layers/chartStyle'
import { drones } from '../../../mocks/watch-floor/drones'
import { useWatchFloorStore } from '../store/useWatchFloorStore'

export function useWatchFloorMap() {
  const container = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    if (!container.current) return
    setWorkerUrl(workerUrl)
    let instance: Map
    try {
      instance = new Map({
        container: container.current, style: chartStyle(), bounds: chartBounds,
        fitBoundsOptions: { padding: 80 },
        attributionControl: false, dragRotate: false, pitchWithRotate: false,
      })
    } catch {
      const timer = setTimeout(() => setError(true), 0)
      return () => clearTimeout(timer)
    }
    instance.getCanvas().setAttribute('aria-label', 'Kochi coastal chart. Use arrow keys to pan and plus or minus to zoom.')
    instance.getCanvas().classList.add('focus-visible:outline-2', 'focus-visible:-outline-offset-2', 'focus-visible:outline-sea')
    instance.on('load', () => {
      instance.fitBounds(chartBounds, { padding: 80, duration: 0 })
      setMap(instance)
    })
    instance.on('error', () => setError(true))
    const observer = new ResizeObserver(() => {
      instance.resize()
    })
    observer.observe(container.current)
    return () => { observer.disconnect(); instance.remove() }
  }, [])
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
  return { container, map, error }
}
