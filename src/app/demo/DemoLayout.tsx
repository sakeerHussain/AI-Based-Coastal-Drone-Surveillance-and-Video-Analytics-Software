import { Outlet } from 'react-router-dom'
import { useDemoStore } from '../../lib/useDemoStore'
import { usePresenterMode } from './usePresenterMode'
import { PresenterBar } from './PresenterBar'

export function DemoLayout() {
  const revision = useDemoStore((state) => state.revision)
  const goTo = usePresenterMode()
  return <div className="flex h-dvh flex-col overflow-hidden bg-paper text-ink">
    <div key={revision} className="min-h-0 flex-1 overflow-auto"><Outlet /></div>
    <PresenterBar onStep={goTo} />
  </div>
}
