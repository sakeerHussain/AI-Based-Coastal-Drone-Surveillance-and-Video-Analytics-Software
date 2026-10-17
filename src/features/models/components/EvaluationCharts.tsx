import { Line, LineChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import type { TrainingConfig } from '../trainingTypes'
export default function EvaluationCharts({ config }: { config: TrainingConfig }) {
  const tick = { fill: 'var(--color-mute)', fontSize: 10 }, tooltip = { background: 'var(--color-panel)', border: '1px solid var(--color-line)', color: 'var(--color-ink)' }
  return <div className="grid gap-3 lg:grid-cols-2 [&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:outline-sea">
    <figure className="min-w-0"><figcaption className="mb-2 text-xs font-semibold">Demo training loss by epoch</figcaption><div className="h-48">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}><LineChart data={config.loss} accessibilityLayer aria-label="Illustrative training loss by epoch">
        <CartesianGrid stroke="var(--color-line)" strokeDasharray="3 3" /><XAxis dataKey="epoch" tick={tick} /><YAxis domain={[0, 1]} tick={tick} width={32} />
        <Tooltip contentStyle={tooltip} /><Line name="Loss" dataKey="loss" stroke="var(--color-sea)" strokeWidth={2} isAnimationActive={false} />
      </LineChart></ResponsiveContainer></div>
      <table className="sr-only"><caption>Demo training loss</caption><thead><tr><th>Epoch</th><th>Loss</th></tr></thead><tbody>{config.loss.map((point) => <tr key={point.epoch}><th>{point.epoch}</th><td>{point.loss}</td></tr>)}</tbody></table>
    </figure>
    <figure className="min-w-0"><figcaption className="mb-2 text-xs font-semibold">Illustrative per-class evaluation</figcaption><div className="h-48">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}><BarChart data={config.metrics} accessibilityLayer aria-label="Illustrative precision recall and F1 by class">
        <CartesianGrid stroke="var(--color-line)" strokeDasharray="3 3" /><XAxis dataKey="label" tick={tick} /><YAxis domain={[0, 1]} tick={tick} width={32} />
        <Tooltip contentStyle={tooltip} /><Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="precision" name="Precision" fill="var(--color-sea)" isAnimationActive={false} />
        <Bar dataKey="recall" name="Recall" fill="var(--color-green)" isAnimationActive={false} />
        <Bar dataKey="f1" name="F1" fill="var(--color-amber)" isAnimationActive={false} />
      </BarChart></ResponsiveContainer></div></figure>
  </div>
}
