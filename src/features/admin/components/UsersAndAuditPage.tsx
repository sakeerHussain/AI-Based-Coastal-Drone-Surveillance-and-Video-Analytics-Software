import { useEffect, useState } from 'react'
import { useAuthStore } from '../../auth'
import { can } from '../../../lib/permissions'
import { useAuditStore } from '../../../lib/useAuditStore'
import { useAdminData } from '../api/admin'
import { useAdminStore } from '../store/useAdminStore'
import type { AdminUser } from '../types'
import { UserDirectory } from './UserDirectory'
import { UserEditorDialog } from './UserEditorDialog'
import { RolePermissions } from './RolePermissions'
import { AuditLog } from './AuditLog'

const sections = ['Users', 'Role permissions', 'Audit log'] as const

export function UsersAndAuditPage() {
  const actor = useAuthStore((state) => state.user)
  const query = useAdminData()
  const users = useAdminStore((state) => state.users)
  const loaded = useAdminStore((state) => state.loaded)
  const hydrate = useAdminStore((state) => state.hydrate)
  const entries = useAuditStore((state) => state.entries)
  const [section, setSection] = useState<typeof sections[number]>('Users')
  const [editor, setEditor] = useState<{ user?: AdminUser } | null>(null)
  const [notice, setNotice] = useState('')
  const canManage = can(actor, 'users:manage')
  useEffect(() => { if (query.data) hydrate(query.data) }, [query.data, hydrate])
  if (query.isError) return <div role="alert" className="p-4 text-sm">Could not load the user directory.
    <button type="button" onClick={() => void query.refetch()} className="ml-3 rounded border border-line bg-panel px-3 py-2 focus-visible:outline-2 focus-visible:outline-sea">Try again</button></div>
  if (!loaded) return <p role="status" className="p-4 text-sm text-mute">Loading user directory…</p>
  return <div className="flex min-h-full flex-col gap-3 p-4">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-xl font-bold tracking-tight">Users and audit</h1>
        <p className="mt-1 text-xs text-mute">Demo user access, role policies and session activity</p></div>
      {canManage && <button type="button" onClick={() => { setNotice(''); setEditor({}) }} className="rounded bg-sea px-4 py-2 text-sm font-semibold text-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">Add user</button>}
    </header>
    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Access and audit overview">
      {[
        ['Directory users', users.length, 'Current demo directory'],
        ['Active accounts', users.filter((user) => user.status === 'Active').length, 'Active in the directory'],
        ['Suspended accounts', users.filter((user) => user.status === 'Suspended').length, 'Suspended in the directory'],
        ['Audit entries', entries.length, 'Recorded during this session'],
      ].map(([label, value, detail]) => <div key={label} className="border border-l-2 border-line border-l-sea bg-panel p-4">
        <dt className="text-xs text-mute">{label}</dt><dd className="mt-2 text-3xl font-bold">{value}</dd>
        <dd className="mt-1 text-xs text-mute">{detail}</dd>
      </div>)}
    </dl>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div role="group" aria-label="Users and audit sections" className="flex flex-wrap gap-1 rounded border border-line bg-panel p-1">
        {sections.map((label) => <button key={label} type="button" aria-pressed={section === label} aria-controls={`admin-${label.replaceAll(' ', '-').toLowerCase()}`}
          onClick={() => setSection(label)} className={`rounded px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-sea ${section === label ? 'bg-shoal font-semibold text-ink' : 'text-mute hover:text-ink'}`}>{label}</button>)}
      </div>
      {!canManage && <p className="text-xs text-mute">Viewing access · Administrators manage users</p>}
    </div>
    <p role="status" aria-live="polite" className={notice ? 'border-l-2 border-green bg-panel px-3 py-2 text-sm' : 'sr-only'}>{notice}</p>
    <div id="admin-users" hidden={section !== 'Users'}>
      <UserDirectory users={users} currentId={actor?.policeId ?? ''} canManage={canManage} onEdit={(user) => { setNotice(''); setEditor({ user }) }} />
    </div>
    <div id="admin-role-permissions" hidden={section !== 'Role permissions'}><RolePermissions /></div>
    <div id="admin-audit-log" hidden={section !== 'Audit log'}><AuditLog /></div>
    {editor && canManage && <UserEditorDialog user={editor.user} currentId={actor?.policeId ?? ''} onClose={() => setEditor(null)} onSaved={setNotice} />}
  </div>
}
