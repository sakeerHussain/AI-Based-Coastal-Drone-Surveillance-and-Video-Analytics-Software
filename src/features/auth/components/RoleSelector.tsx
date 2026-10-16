import type { Role } from '../../../lib/permissions'
import { demoRoles } from '../../../mocks/auth'

export function RoleSelector({ value, onChange }: { value: Role; onChange: (role: Role) => void }) {
  return <fieldset className="mt-5">
    <legend className="sr-only">Demo role</legend>
    <div className="grid grid-cols-2 gap-2">
      {demoRoles.map((role) => <button key={role.value} type="button" aria-pressed={value === role.value}
        onClick={() => onChange(role.value)}
        className={`rounded border border-line px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea ${value === role.value ? 'bg-ink text-paper' : 'bg-panel text-ink'}`}>
        {role.label}
      </button>)}
    </div>
  </fieldset>
}
