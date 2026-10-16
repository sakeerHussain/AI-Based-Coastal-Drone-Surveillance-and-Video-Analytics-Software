import { useRef } from 'react'

export function VerificationCode({ value, onChange, error, errorId }: {
  value: string[]; onChange: (digits: string[]) => void; error?: string; errorId: string
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  function update(index: number, digit: string) {
    if (!/^\d?$/.test(digit)) return
    onChange(value.map((current, position) => position === index ? digit : current))
    if (digit && index < value.length - 1) inputs.current[index + 1]?.focus()
  }
  return <fieldset className="mt-3">
    <legend className="text-sm font-medium">Verification code</legend>
    <div className="mt-1 flex gap-2">
      {value.map((digit, index) => <input key={index} ref={(element) => { inputs.current[index] = element }}
        aria-label={`Verification code digit ${index + 1}`} aria-invalid={!!error} aria-describedby={error ? errorId : undefined}
        type="text" inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} maxLength={1}
        value={digit} onChange={(event) => update(index, event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Backspace' && !digit && index > 0) inputs.current[index - 1]?.focus()
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            inputs.current[index + (event.key === 'ArrowRight' ? 1 : -1)]?.focus()
          }
        }} onPaste={(event) => {
          event.preventDefault()
          const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, value.length - index)
          if (!digits) return
          const next = [...value]
          ;[...digits].forEach((item, offset) => { next[index + offset] = item })
          onChange(next)
          inputs.current[Math.min(index + digits.length, value.length - 1)]?.focus()
        }}
        className="h-11 w-10 min-w-0 rounded border border-line bg-panel text-center font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea" />)}
    </div>
    {error && <p id={errorId} role="alert" className="mt-1 text-xs text-red">{error}</p>}
  </fieldset>
}
