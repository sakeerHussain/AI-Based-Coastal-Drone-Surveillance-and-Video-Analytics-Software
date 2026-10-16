import { useRuleReplay } from '../hooks/useRuleReplay'
import type { Rule } from '../types'

export function RuleReplay({ rule, validate }: { rule: Rule; validate: () => boolean }) {
  const { run, busy, result, progress } = useRuleReplay(rule)
  return <div className="mt-4 text-xs">
    <button type="button" disabled={busy} onClick={() => { if (validate()) run() }}
      className="w-full rounded border border-line px-3 py-2 text-sm font-semibold text-sea focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea disabled:opacity-50">
      {busy ? 'Testing rule…' : 'Test on last 7 days'}
    </button>
    <div className="mt-3 rounded bg-shoal p-3" role="status" aria-live="polite" aria-atomic="true">
      {busy ? <>
        <p>Replaying the last 7 days…</p>
        <div role="progressbar" aria-label="Rule replay progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}
          className="mt-2 h-1.5 overflow-hidden rounded bg-panel">
          <div className="h-full bg-sea" style={{ width: `${progress}%` }} />
        </div>
      </> : result !== null ? <p>This rule would have raised {result} alerts.</p>
        : <p>Test this rule on the last 7 days of footage before saving.</p>}
    </div>
    <p className="mt-1 text-mute">Simulated replay using demo data.</p>
  </div>
}
