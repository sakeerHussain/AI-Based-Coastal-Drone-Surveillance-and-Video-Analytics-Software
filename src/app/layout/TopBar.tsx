import { useAuthStore } from '../../features/auth'
import { shellFixture } from '../../mocks/shell'
import { useIstClock } from './useIstClock'

export function TopBar() {
  const user = useAuthStore((state) => state.user)
  const clock = useIstClock()
  const roleLabel = user ? user.role[0].toUpperCase() + user.role.slice(1) : ''

  return (
    <header className="flex h-12 shrink-0 items-center gap-4 overflow-x-auto whitespace-nowrap border-b border-line bg-panel px-4 text-sm">
      <span className="font-semibold">{shellFixture.sectorName}</span>
      <time dateTime={clock.dateTime} className="text-mute">{clock.label}</time>
      <span className="ml-auto flex items-center gap-1.5">
        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-green" />
        {shellFixture.liveFeeds} of {shellFixture.totalFeeds} feeds live
      </span>
      {user && (
        <span className="rounded bg-shoal px-2 py-0.5 text-xs font-semibold">
          {roleLabel}: {user.name}
        </span>
      )}
    </header>
  )
}
