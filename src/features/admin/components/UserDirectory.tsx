import { useState } from 'react'
import { demoRoles } from '../../../mocks/auth'
import type { AdminUser } from '../types'

const field = 'rounded border border-line bg-panel px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-sea'

export function UserDirectory({ users, canManage, currentId, onEdit }: {
  users: AdminUser[]; canManage: boolean; currentId: string; onEdit: (user: AdminUser) => void
}) {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('name')
  const filtered = users.filter((user) => (!role || user.role === role) && (!status || user.status === status)
    && `${user.name} ${user.policeId}`.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => a[sort as 'name' | 'policeId'].localeCompare(b[sort as 'name' | 'policeId']))
  return <section aria-labelledby="user-directory-title" className="rounded border border-line bg-panel p-4">
    <h2 id="user-directory-title" className="text-base font-semibold">User directory</h2>
    <p className="mt-1 text-xs text-mute">Demo users and account access. Changes last for this session.</p>
    <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_auto]">
      <label className="grid gap-1 text-xs text-mute">Search users
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name or police ID" className={`min-w-0 ${field}`} /></label>
      <label className="grid gap-1 text-xs text-mute">Role
        <select value={role} onChange={(event) => setRole(event.target.value)} className={field}>
          <option value="">All roles</option>{demoRoles.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select></label>
      <label className="grid gap-1 text-xs text-mute">Account status
        <select value={status} onChange={(event) => setStatus(event.target.value)} className={field}>
          <option value="">All statuses</option><option>Active</option><option>Suspended</option>
        </select></label>
      <label className="grid gap-1 text-xs text-mute">Sort users
        <select value={sort} onChange={(event) => setSort(event.target.value)} className={field}>
          <option value="name">Name</option><option value="policeId">Police ID</option>
        </select></label>
      <button type="button" className={`self-end ${field}`} onClick={() => { setSearch(''); setRole(''); setStatus(''); setSort('name') }}>Clear filters</button>
    </div>
    <p role="status" className="my-4 text-xs text-mute">{filtered.length} of {users.length} users</p>
    {!filtered.length ? <p className="py-6 text-sm text-mute">No users match these filters.</p> : <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">Demo user directory</caption>
        <thead className="border-b border-line text-xs text-mute"><tr>
          {['Name', 'Police ID', 'Role', 'Status', ...(canManage ? ['Actions'] : [])].map((label) => <th scope="col" key={label} className="px-3 py-3">{label}</th>)}
        </tr></thead>
        <tbody className="divide-y divide-line">{filtered.map((user) => <tr key={user.policeId} className="hover:bg-paper">
          <th scope="row" className="px-3 py-4 font-semibold">{user.name}
            {user.policeId.toUpperCase() === currentId.toUpperCase() && <span className="ml-2 text-xs font-normal text-mute">You</span>}</th>
          <td className="px-3 py-4">{user.policeId}</td>
          <td className="px-3 py-4">{demoRoles.find((item) => item.value === user.role)?.label}</td>
          <td className="px-3 py-4"><span className={`border-l-2 pl-2 ${user.status === 'Active' ? 'border-green' : 'border-amber'}`}>{user.status}</span></td>
          {canManage && <td className="px-3 py-4"><button type="button" onClick={() => onEdit(user)} aria-label={`Edit user: ${user.name}`} className="text-sea underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-sea">Edit user</button></td>}
        </tr>)}</tbody>
      </table>
    </div>}
  </section>
}
