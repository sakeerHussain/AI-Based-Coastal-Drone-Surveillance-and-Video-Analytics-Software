import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { demoCredentials, mockUser } from '../../../mocks/auth'
import { useAuthStore } from '../hooks/useAuthStore'
import type { Role } from '../../../lib/permissions'
import { RoleSelector } from './RoleSelector'
import { VerificationCode } from './VerificationCode'
import { FormErrorSummary } from '../../../components/FormErrorSummary'
import { focusFirstInvalid } from '../../../lib/focusFirstInvalid'

const schema = z.object({
  policeId: z.string().trim().min(1, 'Enter your police ID.'),
  password: z.string().min(1, 'Enter a demo password.'),
  code: z.string().regex(/^\d{6}$/, 'Enter all six verification digits.'),
})
const field = 'mt-1 w-full rounded border border-line bg-panel px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'
export function SignInForm() {
  const signIn = useAuthStore((state) => state.signIn)
  const navigate = useNavigate()
  const id = useId()
  const [role, setRole] = useState<Role>(mockUser.role)
  const [policeId, setPoliceId] = useState(demoCredentials.policeId)
  const [password, setPassword] = useState(demoCredentials.password)
  const [digits, setDigits] = useState([...demoCredentials.code])
  const [attempt, setAttempt] = useState(0)
  const result = schema.safeParse({ policeId, password, code: digits.join('') })
  const errors = attempt > 0 && !result.success ? Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])) : {}
  return <form noValidate className="w-full max-w-sm" onSubmit={(event) => {
    event.preventDefault(); setAttempt((value) => value + 1)
    if (!result.success) { focusFirstInvalid(event.currentTarget); return }
    signIn(role, result.data.policeId)
    void navigate('/watch-floor')
  }}>
    <h1 className="text-lg font-bold">Sign in to Coastal Watch</h1>
    <p className="mt-1 text-sm text-mute">Your role decides what you can view, export and change.</p>
    <RoleSelector value={role} onChange={setRole} />
    <FormErrorSummary count={Object.keys(errors).length} attempt={attempt} />
    <label htmlFor={`${id}-police`} className="mt-4 block text-sm font-medium">Police ID</label>
    <input id={`${id}-police`} value={policeId} onChange={(event) => setPoliceId(event.target.value)}
      autoComplete="username" aria-invalid={!!errors.policeId} aria-describedby={errors.policeId ? `${id}-police-error` : undefined} className={field} />
    {errors.policeId && <p id={`${id}-police-error`} role="alert" className="mt-1 text-xs text-red">{errors.policeId}</p>}
    <label htmlFor={`${id}-password`} className="mt-3 block text-sm font-medium">Password</label>
    <input id={`${id}-password`} type="password" value={password} onChange={(event) => setPassword(event.target.value)}
      autoComplete="current-password" aria-invalid={!!errors.password} aria-describedby={errors.password ? `${id}-password-error` : undefined} className={field} />
    {errors.password && <p id={`${id}-password-error`} role="alert" className="mt-1 text-xs text-red">{errors.password}</p>}
    <VerificationCode value={digits} onChange={setDigits} error={errors.code} errorId={`${id}-code-error`} />
    <button type="submit" className="mt-5 w-full rounded bg-sea py-2.5 font-semibold text-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">Sign in</button>
    <p className="mt-3 text-xs text-mute">This session is recorded for audit. Authorised use only.</p>
    <p className="mt-2 text-xs text-mute">Demo sign-in only. No real authentication.</p>
  </form>
}
