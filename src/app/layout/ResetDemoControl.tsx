import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../features/auth'
import { can } from '../../lib/permissions'
import { resetDemo } from '../demo/resetDemo'

export function ResetDemoControl() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  if (!can(user, 'demo:reset')) return null
  return <button type="button" onClick={() => { if (resetDemo(user)) void navigate('/sign-in', { replace: true }) }}
    className="shrink-0 rounded border border-line bg-panel px-3 py-1 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">
    Reset demo
  </button>
}
