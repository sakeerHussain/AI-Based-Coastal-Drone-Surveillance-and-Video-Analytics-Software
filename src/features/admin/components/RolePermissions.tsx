import { can, permissionLabels } from '../../../lib/permissions'
import { demoRoles } from '../../../mocks/auth'

export function RolePermissions() {
  return <section aria-labelledby="role-permissions-title" className="rounded border border-line bg-panel p-4">
    <h2 id="role-permissions-title" className="text-base font-semibold">Role permissions</h2>
    <p className="mt-1 text-xs text-mute">Existing role policies are read-only. Assign a role through the user directory.</p>
    <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm">
      <caption className="sr-only">All configured page and action permissions by role</caption>
      <thead className="border-b border-line text-xs text-mute"><tr>
        <th scope="col" className="px-3 py-3">Permission</th>
        {demoRoles.map((role) => <th key={role.value} scope="col" className="px-3 py-3">{role.label}</th>)}
      </tr></thead>
      <tbody className="divide-y divide-line">{permissionLabels.map((permission) => <tr key={permission.action} className="hover:bg-paper">
        <th scope="row" className="px-3 py-3 font-medium">{permission.label}</th>
        {demoRoles.map((role) => <td key={role.value} className="px-3 py-3">
          {can({ role: role.value }, permission.action) ? 'Allowed' : <span className="text-mute">Restricted</span>}
        </td>)}
      </tr>)}</tbody>
    </table></div>
  </section>
}
