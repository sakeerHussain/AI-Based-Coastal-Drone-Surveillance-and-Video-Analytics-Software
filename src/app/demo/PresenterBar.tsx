import { demoSteps } from '../../mocks/demo'
import { useDemoStore } from '../../lib/useDemoStore'

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'
export function PresenterBar({ onStep }: { onStep: (index: number) => void }) {
  const enabled = useDemoStore((state) => state.enabled)
  const step = useDemoStore((state) => state.step)
  const notice = useDemoStore((state) => state.notice)
  if (!enabled) return null
  return <footer aria-label="Presenter mode" className="shrink-0 border-t border-line bg-panel px-4 py-2 text-xs">
    <nav aria-label="Demo steps" className="flex flex-wrap items-center gap-1">
      {demoSteps.map((item, index) => <button key={item.title} type="button" onClick={() => onStep(index)}
        aria-current={step === index ? 'step' : undefined}
        className={`rounded border border-line px-2 py-1 ${focus} ${step === index ? 'bg-ink text-paper' : 'bg-panel text-ink'}`}>
        {index + 1}. {item.title}
      </button>)}
      <span className="ml-auto text-mute">P to hide · Left/right to navigate</span>
    </nav>
    <p role="status" className={`mt-1 ${notice ? 'text-red' : 'text-mute'}`}>{notice || demoSteps[step].note}</p>
  </footer>
}
