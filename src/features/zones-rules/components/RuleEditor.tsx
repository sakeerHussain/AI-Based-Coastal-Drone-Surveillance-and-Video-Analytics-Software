import { useState } from 'react'
import { useAuthStore } from '../../auth'
import { ruleOptions } from '../../../mocks/zones-rules/fixtures'
import { useZonesRulesStore } from '../store/useZonesRulesStore'
import { validateRule } from '../ruleSchema'
import type { Rule, RuleErrors, Zone } from '../types'
import { RuleSelect } from './RuleSelect'
import { RuleReplay } from './RuleReplay'

export function RuleEditor({ zone, zones, rule }: { zone: Zone; zones: Zone[]; rule: Rule }) {
  const [attempted, setAttempted] = useState(false)
  const edit = useZonesRulesStore((state) => state.editRule)
  const save = useZonesRulesStore((state) => state.saveRule)
  const select = useZonesRulesStore((state) => state.select)
  const user = useAuthStore((state) => state.user)
  const errors: RuleErrors = attempted ? validateRule(rule, zones.map((item) => item.id)) : {}
  function validate() {
    setAttempted(true)
    return Object.keys(validateRule(rule, zones.map((item) => item.id))).length === 0
  }
  function field(key: keyof typeof ruleOptions, label: string) {
    return <RuleSelect label={label} value={rule[key]} options={ruleOptions[key]} error={errors[key]}
      onChange={(value) => edit(zone.id, { [key]: value })} />
  }
  return <aside className="min-w-0 bg-panel p-4">
    <h2 className="font-bold">Rule for {zone.id}</h2>
    <p className="mt-1 text-sm text-mute">Written as a sentence. No code needed.</p>
    <form noValidate onSubmit={(event) => {
      event.preventDefault()
      if (validate() && user) save(zone.id, user.name)
    }}>
      <div className="mt-4 text-[15px] leading-9">
        Raise an alert when a {field('object', 'Object')} stays inside{' '}
        <RuleSelect label="Rule zone" value={rule.zoneId} options={zones.map((item) => item.id)} error={errors.zoneId}
          onChange={(value) => { if (value && value !== zone.id) select(value); else edit(zone.id, { zoneId: value }) }} />{' '}
        for more than {field('threshold', 'Dwell time')} between {field('hours', 'Monitoring hours')}.{' '}
        Mark it {field('severity', 'Severity')} and notify {field('notify', 'Notify')}.{' '}
        If nobody acknowledges within {field('acknowledge', 'Acknowledgement time')},{' '}
        escalate to {field('escalate', 'Escalate to')}.
      </div>
      <div className="mt-4 text-sm">
        <label htmlFor="sensitivity" className="flex justify-between font-semibold">
          Sensitivity <span>{rule.sensitivity}%</span>
        </label>
        <input id="sensitivity" type="range" min="0" max="100" step="1" value={rule.sensitivity}
          onChange={(event) => edit(zone.id, { sensitivity: Number(event.target.value) })}
          aria-invalid={!!errors.sensitivity} aria-describedby={errors.sensitivity ? 'sensitivity-error' : undefined}
          className="mt-1 w-full accent-sea focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea" />
        {errors.sensitivity && <p id="sensitivity-error" role="alert" className="text-xs text-red">{errors.sensitivity}</p>}
        <div className="flex justify-between text-xs text-mute"><span>Fewer alerts</span><span>More alerts</span></div>
      </div>
      <RuleReplay rule={rule} validate={validate} />
      <button type="submit" className="mt-4 w-full rounded bg-sea py-2.5 font-semibold text-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea">
        Save rule
      </button>
    </form>
  </aside>
}
