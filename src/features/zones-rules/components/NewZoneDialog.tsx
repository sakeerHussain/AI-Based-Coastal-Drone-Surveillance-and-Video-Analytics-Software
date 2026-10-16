import { useEffect, useRef, useState } from 'react'
import { zoneTypes } from '../../../mocks/zones-rules/fixtures'
import { newZoneSchema } from '../ruleSchema'
import type { ZoneType } from '../types'
import { FormErrorSummary } from '../../../components/FormErrorSummary'
import { focusFirstInvalid } from '../../../lib/focusFirstInvalid'

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'
export function NewZoneDialog({ onSave, onClose }: {
  onSave: (name: string, type: ZoneType) => void; onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const element = dialog.current!
    const previous = document.activeElement
    element.showModal()
    return () => { element.close(); if (previous instanceof HTMLElement) previous.focus({ preventScroll: true }) }
  }, [])
  return <dialog ref={dialog} aria-labelledby="new-zone-title"
    onCancel={(event) => { event.preventDefault(); onClose() }}
    className="fixed inset-0 m-auto w-[calc(100%_-_2rem)] max-w-md rounded border border-line bg-panel p-5 text-ink backdrop:bg-ink/40">
    <form noValidate onSubmit={(event) => {
      event.preventDefault()
      setAttempt((value) => value + 1)
      const result = newZoneSchema.safeParse({ name, type })
      if (!result.success) {
        setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])))
        focusFirstInvalid(event.currentTarget)
        return
      }
      onSave(result.data.name, result.data.type)
    }}>
      <h2 id="new-zone-title" className="font-bold">Name your zone</h2>
      <FormErrorSummary count={Object.keys(errors).length} attempt={attempt} />
      <label className="mt-4 block text-sm" htmlFor="zone-name">Zone name</label>
      <input id="zone-name" value={name} onChange={(event) => setName(event.target.value)}
        aria-invalid={!!errors.name} aria-describedby={errors.name ? 'zone-name-error' : undefined}
        className={`mt-1 w-full rounded border border-line bg-panel px-3 py-2 ${focus}`} />
      {errors.name && <p id="zone-name-error" role="alert" className="mt-1 text-xs text-red">{errors.name}</p>}
      <label className="mt-4 block text-sm" htmlFor="zone-type">Zone type</label>
      <select id="zone-type" value={type} onChange={(event) => setType(event.target.value)}
        aria-invalid={!!errors.type} aria-describedby={errors.type ? 'zone-type-error' : undefined}
        className={`mt-1 w-full rounded border border-line bg-panel px-3 py-2 ${focus}`}>
        <option value="">Choose a type</option>
        {zoneTypes.map((value) => <option key={value}>{value}</option>)}
      </select>
      {errors.type && <p id="zone-type-error" role="alert" className="mt-1 text-xs text-red">{errors.type}</p>}
      <div className="mt-5 flex gap-3 text-sm font-semibold">
        <button type="submit" className={`rounded bg-sea px-4 py-2 text-panel ${focus}`}>Create zone</button>
        <button type="button" onClick={onClose} className={`rounded border border-line px-4 py-2 ${focus}`}>Cancel</button>
      </div>
    </form>
  </dialog>
}
