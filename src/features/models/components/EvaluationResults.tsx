import { lazy, Suspense } from 'react'
import type { TrainingJob } from '../trainingTypes'
const EvaluationCharts = lazy(() => import('./EvaluationCharts'))
export function EvaluationResults({ job }: { job: TrainingJob }) {
  return <section className="space-y-3 rounded border border-line bg-panel p-4" aria-label="Training evaluation results">
    <h2 className="text-sm font-semibold">Evaluation · {job.base.name}</h2>
    <p className="text-xs text-mute">{job.config.evaluationSet}. Metrics are demo fixtures, independent of annotation edits; no actual model is trained. Classes outside this holdout have no evaluation results.</p>
    <p className="text-xs">Dataset: {job.datasetName} {job.snapshot.name} · {job.snapshot.frames.length} frozen sample frames · Authorized by {job.authorizedBy}</p>
    <Suspense fallback={<p role="status" className="h-48 text-sm text-mute">Loading evaluation charts…</p>}><EvaluationCharts config={job.config} /></Suspense>
    <div className="overflow-x-auto"><table className="w-full text-left text-xs"><caption className="sr-only">Illustrative evaluation metrics</caption>
      <thead><tr className="border-b border-line">{['Class', 'Precision', 'Recall', 'F1'].map((label) => <th key={label} scope="col" className="py-2 pr-3">{label}</th>)}</tr></thead>
      <tbody>{job.config.metrics.map((metric) => <tr key={metric.label} className="border-b border-line"><th scope="row" className="py-2 font-medium">{metric.label}</th>
        <td>{metric.precision.toFixed(2)}</td><td>{metric.recall.toFixed(2)}</td><td>{metric.f1.toFixed(2)}</td></tr>)}</tbody></table></div>
    <p className="text-xs text-mute">The staging candidate is available in the registry and version comparison. Request promotion and record authority approval to change its stage.</p>
  </section>
}
