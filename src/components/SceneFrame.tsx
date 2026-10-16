import type { SceneData } from './sceneTypes'

const tones = { red: 'text-red', amber: 'text-amber', green: 'text-green' }
export function SceneFrame({ scene }: { scene: SceneData }) {
  return (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice"
      className="h-full w-full bg-ink" role="img" aria-label={scene.description}>
      <rect width="320" height="180" className="fill-sea opacity-50" />
      <path d="M0 60q80-14 160 0t160-6M0 100q90 12 170 0t150 8"
        className="stroke-panel/15" fill="none" />
      {scene.sand && <path d="M0 128C60 116 120 142 190 130S290 120 320 134V180H0Z" className="fill-land" />}
      {scene.zone && <polygon points="90,40 250,34 262,112 100,120"
        className="fill-red/10 stroke-red" strokeDasharray="4 3" />}
      {scene.objects.map((object, index) => {
        const cx = object.x + object.width / 2
        const cy = object.y + object.height / 2
        return (
          <g key={index} className={tones[object.tone]}>
            {object.kind === 'person'
              ? <circle cx={cx} cy={cy} r="2.4" className="fill-land" />
              : <ellipse cx={cx} cy={cy} rx={object.width / 2.8} ry={object.height / 3.4} className="fill-paper" />}
            {object.kind === 'vessel' && <path d={`M${cx - object.width / 2.8 - 6} ${cy + 3}q-8 3 -14 8`}
              fill="none" className="stroke-panel/30" />}
            <rect x={object.x} y={object.y} width={object.width} height={object.height}
              fill="none" stroke="currentColor" strokeWidth="1.2" />
            <rect x={object.x} y={object.y - 9} width={object.label.length * 3.7 + 6}
              height="9" className="fill-panel" stroke="currentColor" strokeWidth="0.5" />
            <text x={object.x + 3} y={object.y - 2} fontSize="6.5" fontWeight="600" className="fill-ink">
              {object.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
