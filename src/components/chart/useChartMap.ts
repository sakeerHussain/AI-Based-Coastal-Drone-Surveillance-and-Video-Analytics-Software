import { useEffect, useRef, useState } from 'react'
import { Map, setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import { chartStyle } from './chartStyle'
import type { ChartData } from './types'

export function useChartMap(data: ChartData) {
  const initialData = useRef(data)
  const container = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    if (!container.current) return
    const chartBounds = initialData.current.bounds
    setWorkerUrl(workerUrl)
    let instance: Map
    try {
      instance = new Map({
        container: container.current, style: chartStyle(initialData.current), bounds: chartBounds,
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
  return { container, map, error }
}
