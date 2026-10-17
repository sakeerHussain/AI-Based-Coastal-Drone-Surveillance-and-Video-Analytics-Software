import { useRef, useState } from 'react'
import { Dialog } from '../../../components/Dialog'
import { FormErrorSummary } from '../../../components/FormErrorSummary'
import { focusFirstInvalid } from '../../../lib/focusFirstInvalid'
import { demoRoles } from '../../../mocks/auth'
import { adminUserSchema, type AdminUser } from '../types'
import { useAdminStore } from '../store/useAdminStore'

const field = 'mt-1 w-full rounded border border-line bg-panel px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-sea'

export function UserEditorDialog({ user, currentId, onClose, onSaved }: {
  user?: AdminUser; currentId: string; onClose: () => void; onSaved: (message: string) => void
}) {
  const original: AdminUser = user ?? { name: '', policeId: '', role: 'operator', status: 'Active' }
  const [draft, setDraft] = useState<AdminUser>(original)
  const [errors, setErrors] = useState<Partial<Record<keyof AdminUser, string>>>({})
  const [attempt, setAttempt] = useState(0)
  const [failure, setFailure] = useState('')
  const [discarding, setDiscarding] = useState(false)
  const form = useRef<HTMLFormElement>(null)
  const save = useAdminStore((state) => state.saveUser)
  const dirty = Object.keys(original).some((key) => original[key as keyof AdminUser] !== draft[key as keyof AdminUser])
  const self = user?.policeId.toUpperCase() === currentId.toUpperCase()
  function requestClose() { if (dirty) setDiscarding(true); else onClose() }
  function edit(key: keyof AdminUser, value: string) {
    setDraft((previous) => ({ ...previous, [key]: value }))
    setFailure('')
    setDiscarding(false)
  }
  return <Dialog title={user ? 'Edit demo user' : 'Add demo user'} onClose={requestClose}>
    <form ref={form} noValidate className="p-4" onSubmit={(event) => {
      event.preventDefault()
      setAttempt((value) => value + 1)
      setFailure('')
      const result = adminUserSchema.safeParse(draft)
      if (!result.success) {
        setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])))
        focusFirstInvalid(form.current)
        return
      }
      setErrors({})
      const saved = save(result.data, user?.policeId)
      if (!saved.ok) { setFailure(saved.message); return }
      onSaved(!saved.changed ? 'No changes to save.' : user ? 'User changes saved. Change logged in audit.' : 'Demo user added. Change logged in audit.')
      onClose()
    }}>
      <p className="text-sm text-mute">Manage the demo directory. This does not create a production login.</p>
      <FormErrorSummary count={Object.keys(errors).length} attempt={attempt} />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm">Name
          <input autoComplete="off" value={draft.name} onChange={(event) => edit('name', event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'user-name-error' : undefined} className={field} />
          {errors.name && <span id="user-name-error" className="mt-1 block text-xs text-red">{errors.name}</span>}</label>
        <label className="text-sm">Police ID
          <input autoComplete="off" value={draft.policeId} readOnly={!!user} onChange={(event) => edit('policeId', event.target.value)} aria-invalid={!!errors.policeId} aria-describedby={errors.policeId ? 'user-id-error' : 'user-id-help'} className={`${field} read-only:bg-paper`} />
          <span id="user-id-help" className="mt-1 block text-xs text-mute">{user ? 'The police ID cannot be changed.' : 'Letters, numbers and hyphens only.'}</span>
          {errors.policeId && <span id="user-id-error" className="mt-1 block text-xs text-red">{errors.policeId}</span>}</label>
        <label className="text-sm">Role
          <select value={draft.role} onChange={(event) => edit('role', event.target.value)} aria-invalid={!!errors.role} aria-describedby={errors.role ? 'user-role-error' : undefined} className={field}>
            {demoRoles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
          </select>{errors.role && <span id="user-role-error" className="mt-1 block text-xs text-red">{errors.role}</span>}</label>
        <label className="text-sm">Account status
          <select value={draft.status} onChange={(event) => edit('status', event.target.value)} aria-invalid={!!errors.status} aria-describedby={self ? 'user-status-help' : errors.status ? 'user-status-error' : undefined} className={field}>
            <option>Active</option><option disabled={self}>Suspended</option>
          </select>
          {self && <span id="user-status-help" className="mt-1 block text-xs text-mute">You cannot suspend your own account.</span>}
          {errors.status && <span id="user-status-error" className="mt-1 block text-xs text-red">{errors.status}</span>}</label>
      </div>
      {failure && <p role="alert" className="mt-4 border-l-4 border-red bg-paper p-3 text-sm">{failure}</p>}
      {self && draft.role !== original.role && <p className="mt-4 text-sm text-mute">Changing your role will immediately update your access for this session.</p>}
      {discarding && <div role="alert" className="mt-4 border-l-4 border-amber bg-paper p-3 text-sm">
        <p>Discard your unsaved changes?</p>
        <div className="mt-2 flex gap-3">
          <button type="button" onClick={() => setDiscarding(false)} className="underline focus-visible:outline-2 focus-visible:outline-sea">Keep editing</button>
          <button type="button" onClick={onClose} className="underline focus-visible:outline-2 focus-visible:outline-sea">Discard changes</button>
        </div>
      </div>}
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={requestClose} className="rounded border border-line px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-sea">Cancel</button>
        <button type="submit" className="rounded bg-sea px-4 py-2 text-sm font-semibold text-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">{user ? 'Save changes' : 'Add user'}</button>
      </div>
    </form>
  </Dialog>
}
