# AGENTS.md (repo root; Codex reads it automatically)

## Project
Coastal Drone Surveillance console for Kerala Police. Read docs/00_START_HERE.md before any task.

## Stack and commands
React 19 + Vite + TypeScript, Tailwind CSS v4 (@tailwindcss/vite).
Install: `npm i`. Dev: `npm run dev`.
Check: `npm run lint && npm run typecheck && npm run build`.

## Rules
- Follow the folder layout in docs/00_START_HERE.md section 3. Never import from another feature's internals; use its index.ts.
- Colour and type tokens live only in the @theme block in src/index.css. Edit src/index.css only when the task says so. Do not create tailwind.config.js or postcss.config.js. Do not hardcode hex values in components.
- Sentence case text. No all-caps labels. No gradients as decoration. No icons or emoji unless the task asks.
- No new dependencies without asking.
- Data comes from src/mocks. Do not hardcode data inside components.
- Every screen: visible keyboard focus, works at 1366px and 1920px wide, prefers-reduced-motion respected.
- Keep each file under 200 lines.
- Visual tasks must not change behaviour, data, routes or store logic.
- Do not commit. The owner reviews and commits.
- If a requirement is unclear, stop and ask. Do not guess RFP behaviour.

## Process
Before writing code, list the files you will create or change and wait for approval.

## Done means
Lint, typecheck and build pass, and the screen matches docs/reference/coastal-drone-mock.html unless the task says the design has changed.