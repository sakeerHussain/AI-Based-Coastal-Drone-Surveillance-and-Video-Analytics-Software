import { useZonesRulesStore } from '../store/useZonesRulesStore'
import type { Rule } from '../types'

export function ZonesRulesSummary() {
  const zones = useZonesRulesStore((state) => state.zones)
  const rules = useZonesRulesStore((state) => state.rules)
  const drafts = useZonesRulesStore((state) => state.drafts)
  const selectedId = useZonesRulesStore((state) => state.selectedId)
  const selected = drafts[selectedId]
  const unsaved = Object.entries(drafts).filter(([id, draft]) => !rules[id]
    || (Object.keys(draft) as (keyof Rule)[]).some((key) => draft[key] !== rules[id][key])).length
  const metrics = [
    { label: 'Total zones', value: zones.length, detail: 'Current coastal boundaries', tone: 'border-l-sea' },
    { label: 'Saved rules', value: Object.keys(rules).length, detail: 'Configured monitoring rules', tone: 'border-l-green' },
    { label: 'Unsaved rule drafts', value: unsaved, detail: 'New or changed rules', tone: 'border-l-amber' },
    { label: 'High-severity rules', value: Object.values(rules).filter((rule) => rule.severity === 'High').length, detail: 'Saved rules only', tone: 'border-l-red' },
    { label: 'Selected sensitivity', value: selected ? `${selected.sensitivity}%` : '—', detail: `${selectedId} · Current draft`, tone: 'border-l-sea' },
  ]
  return <dl aria-label="Zones and rules overview" className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
    {metrics.map((metric) => <div key={metric.label} className={`rounded border border-line border-l-[3px] bg-panel px-4 py-3 ${metric.tone}`}>
      <dt className="text-xs font-medium text-mute">{metric.label}</dt>
      <dd className="mt-2">
        <span className="block text-[26px] font-bold leading-none tracking-tight">{metric.value}</span>
        <span className="mt-2 block text-[11px] text-mute">{metric.detail}</span>
      </dd>
    </div>)}
  </dl>
}
