import { useRef, useState, type PointerEvent } from 'react'
import type { AnnotationBox, DatasetFrame } from '../types'
export function AnnotationCanvas({ frame, boxes, selectedId, onSelect, onAdd }: {
  frame: DatasetFrame; boxes: AnnotationBox[]; selectedId: string; onSelect: (id: string) => void
  onAdd: (bounds: Pick<AnnotationBox, 'x' | 'y' | 'width' | 'height'>) => void
}) {
  const svg = useRef<SVGSVGElement>(null), [start, setStart] = useState<{ x: number; y: number } | null>(null)
  function point(event: PointerEvent<SVGSVGElement>) {
    const rect = svg.current!.getBoundingClientRect()
    return { x: Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100)), y: Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100)) }
  }
  return <div>
    <p id="canvas-help" className="mb-2 text-xs text-mute">Drag to draw a box, or use Add box and the numeric controls below. Schematic demo frame.</p>
    <div className="relative"><svg ref={svg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-label={`Annotation frame: ${frame.name}`} aria-describedby="canvas-help"
      className="h-72 w-full touch-none rounded border border-line bg-shoal"
      onPointerDown={(event) => { if (event.button !== 0) return; setStart(point(event)); event.currentTarget.setPointerCapture(event.pointerId) }}
      onPointerCancel={() => setStart(null)} onPointerUp={(event) => {
        if (!start) return
        const end = point(event), width = Math.abs(end.x - start.x), height = Math.abs(end.y - start.y)
        if (width >= 1 && height >= 1) onAdd({ x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), width, height })
        setStart(null)
      }}>
      <path d="M0 20Q25 15 50 20T100 20M0 45Q25 40 50 45T100 45" className="stroke-sea/20" fill="none" strokeWidth="0.4" />
      {frame.shore && <path d="M0 80Q30 70 60 80T100 75V100H0Z" className="fill-land" />}
      {frame.boxes.map((box) => <ellipse key={box.id} cx={box.x + box.width / 2} cy={box.y + box.height / 2} rx={box.width / 3} ry={box.height / 3} className="fill-sea" />)}
      {boxes.map((box, index) => <g key={box.id} role="button" tabIndex={0} aria-label={`Select annotation ${index + 1}: ${box.label}`}
        className="cursor-pointer focus-visible:outline-2 focus-visible:outline-sea" onPointerDown={(event) => event.stopPropagation()}
        onClick={() => onSelect(box.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(box.id) } }}>
        <rect x={box.x} y={box.y} width={box.width} height={box.height} fill="transparent" className={selectedId === box.id ? 'stroke-red' : 'stroke-sea'} strokeWidth="0.7" />
      </g>)}
    </svg>
      {boxes.map((box, index) => <span key={box.id} aria-hidden="true" style={{ left: `${box.x}%`, top: `${Math.max(0, box.y - 6)}%` }}
        className="pointer-events-none absolute max-w-full rounded bg-panel px-1 text-[10px] text-ink">{index + 1}. {box.label}</span>)}
    </div>
  </div>
}
