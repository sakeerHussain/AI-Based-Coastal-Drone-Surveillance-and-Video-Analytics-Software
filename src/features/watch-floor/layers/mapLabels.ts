import { Marker, type Map, type PositionAnchor } from 'maplibre-gl'
import { readChartTokens } from '../../../lib/themeTokens'

export interface MapLabel {
  text: string
  position: [number, number]
  className: string
  priority: number
  anchor: PositionAnchor
  offset: [number, number]
}

export function addMapLabels(map: Map, labels: MapLabel[]) {
  const panel = readChartTokens().panel
  const halo = [
    [-1.5, -1.5], [0, -1.5], [1.5, -1.5], [-1.5, 0],
    [1.5, 0], [-1.5, 1.5], [0, 1.5], [1.5, 1.5],
  ].map(([x, y]) => `${x}px ${y}px 0 ${panel}`).join(', ')
  const entries = [...labels].sort((a, b) => a.priority - b.priority).map((label) => {
    const element = document.createElement('span')
    element.className = `whitespace-nowrap font-sans ${label.className}`
    element.textContent = label.text
    element.style.textShadow = halo
    element.style.pointerEvents = 'none'
    element.style.visibility = 'hidden'
    const marker = new Marker({ element, anchor: label.anchor, offset: label.offset })
      .setLngLat(label.position).addTo(map)
    return { element, marker }
  })
  let disposed = false
  function placeLabels() {
    if (disposed) return
    const bounds = map.getContainer().getBoundingClientRect()
    const occupied: DOMRect[] = []
    for (const { element } of entries) {
      const rect = element.getBoundingClientRect()
      const inside = rect.left >= bounds.left && rect.right <= bounds.right
        && rect.top >= bounds.top && rect.bottom <= bounds.bottom
      const overlaps = occupied.some((other) =>
        rect.left < other.right + 4 && rect.right + 4 > other.left
        && rect.top < other.bottom + 4 && rect.bottom + 4 > other.top)
      const visible = inside && !overlaps
      element.style.visibility = visible ? 'visible' : 'hidden'
      element.setAttribute('aria-hidden', String(!visible))
      if (visible) occupied.push(rect)
    }
  }
  map.on('render', placeLabels)
  const observer = new ResizeObserver(placeLabels)
  observer.observe(map.getContainer())
  const frame = requestAnimationFrame(placeLabels)
  void document.fonts.ready.then(placeLabels)
  return () => {
    disposed = true
    cancelAnimationFrame(frame)
    observer.disconnect()
    map.off('render', placeLabels)
    entries.forEach(({ marker }) => marker.remove())
  }
}
