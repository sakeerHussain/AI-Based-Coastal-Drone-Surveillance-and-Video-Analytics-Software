import type { ViewAction } from '../lib/permissions'

export const demoSteps: { title: string; path: string; note: string; action?: ViewAction }[] = [
  { title: 'Sign in', path: '/sign-in', note: 'Role-based access with a recorded demo session.' },
  { title: 'Watch floor', path: '/watch-floor', note: 'Live video, chart positions and telemetry together.', action: 'view:watch-floor' },
  { title: 'Alert raised', path: '/watch-floor', note: 'A high alert is raised immediately for the restricted anchorage.', action: 'view:watch-floor' },
  { title: 'Review incident', path: '/incidents/vessel-z04', note: 'Sealed evidence and a record of every action.', action: 'view:incidents' },
  { title: 'Feed wall', path: '/feed-wall', note: 'Nine feeds at once, scaling to 20 and beyond.', action: 'view:feed-wall' },
  { title: 'Zones and rules', path: '/zones-rules', note: 'Write rules as sentences and replay before saving.', action: 'view:zones-rules' },
  { title: 'Models and health', path: '/models', note: 'Authority approval and visible system health.', action: 'view:models' },
]
