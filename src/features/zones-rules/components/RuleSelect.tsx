import { useId } from 'react'

interface Props {
  label: string; value: string; options: readonly string[]; error?: string
  onChange: (value: string) => void
}
export function RuleSelect({ label, value, options, error, onChange }: Props) {
  const id = useId()
  return <span className="inline-flex max-w-full flex-col align-middle leading-normal">
    <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}
      aria-invalid={!!error} aria-describedby={error ? id : undefined}
      className="max-w-full rounded-t border-b-2 border-sea bg-shoal px-1 py-0.5 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">
      <option value="">Choose…</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
    {error && <span id={id} role="alert" className="py-1 text-xs text-red">{error}</span>}
  </span>
}
