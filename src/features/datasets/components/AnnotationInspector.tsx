import type { AnnotationBox } from '../types'
export function AnnotationInspector({ box, classes, onChange, onDelete }: {
  box: AnnotationBox | undefined; classes: string[]; onChange: (box: AnnotationBox) => void; onDelete: () => void
}) {
  if (!box) return <p className="text-xs text-mute">Select an annotation to edit its class and bounds.</p>
  return <fieldset className="rounded border border-line p-3 text-xs"><legend className="px-1 font-semibold">Selected annotation</legend>
    <label className="block">Class<select value={box.label} onChange={(event) => onChange({ ...box, label: event.target.value })}
      className="ml-2 rounded border border-line bg-panel p-2 focus-visible:outline-2 focus-visible:outline-sea">{classes.map((name) => <option key={name}>{name}</option>)}</select></label>
    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{(['x', 'y', 'width', 'height'] as const).map((field) => <label key={field}>
      {field === 'x' ? 'Left' : field === 'y' ? 'Top' : field === 'width' ? 'Width' : 'Height'} (%)
      <input type="number" min={field === 'x' || field === 'y' ? 0 : 1} max="100" step="0.1" value={Number(box[field].toFixed(1))}
        onChange={(event) => onChange({ ...box, [field]: event.target.valueAsNumber || 0 })}
        className="mt-1 w-full rounded border border-line bg-panel p-2 focus-visible:outline-2 focus-visible:outline-sea" />
    </label>)}</div>
    <button type="button" onClick={onDelete} className="mt-3 rounded border border-line px-3 py-2 text-red focus-visible:outline-2 focus-visible:outline-sea">Delete annotation</button>
  </fieldset>
}
