import { formatIstTime } from '../../../lib/time'
import { useZonesRulesStore } from '../store/useZonesRulesStore'
import type { Rule } from '../types'

export function RuleSaveStatus({ zoneId, rule }: { zoneId: string; rule: Rule }) {
  const saved = useZonesRulesStore((state) => state.rules[zoneId])
  const savedAt = useZonesRulesStore((state) => state.savedAt[zoneId])
  const dirty = !saved || (Object.keys(rule) as (keyof Rule)[]).some((key) => rule[key] !== saved[key])
  return <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm" role="status" aria-atomic="true">
    <span className={`border-l-4 pl-2 font-semibold text-ink ${dirty ? 'border-amber' : 'border-green'}`}>
      {dirty ? 'Unsaved changes' : 'Saved'}
    </span>
    {savedAt !== undefined && <span className="text-mute">Last saved{' '}
      <time dateTime={new Date(savedAt).toISOString()}>{formatIstTime(savedAt)} IST</time>
    </span>}
  </div>
}
