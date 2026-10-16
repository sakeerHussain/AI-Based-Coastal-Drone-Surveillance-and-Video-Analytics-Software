# AGENTS.md (place at repo root; Codex reads it automatically)

## Project

Coastal Drone Surveillance console for Kerala Police. Read docs/00_START_HERE.md before any task.

## Stack and commands

React + Vite + TypeScript, Tailwind CSS. Install: `npm i`. Dev: `npm run dev`. Check: `npm run lint && npm run typecheck && npm build`.

## Rules

- Follow the folder layout in 00_START_HERE.md section 3. Never import from another feature's internals.
- Use only the colour and type tokens in section 4. They are defined once in the @theme block in src/index.css (Tailwind v4). Do not create tailwind.config.js or postcss.config.js. Do not hardcode hex values in components.
- Sentence case text. No all-caps labels. No gradients as decoration. No new dependencies without asking.
- Data comes from src/mocks (MSW). Do not hardcode data inside components.
- Every screen: keyboard focus visible, works at 1366px and 1920px wide, reduced-motion respected.
- Keep each file under 200 lines. Small commits, one screen or feature per task.
- If a requirement is unclear, stop and ask. Do not guess RFP behaviour.

## Done means

Lint, typecheck and tests pass, and the screen matches docs/reference/coastal-drone-mock.html.
