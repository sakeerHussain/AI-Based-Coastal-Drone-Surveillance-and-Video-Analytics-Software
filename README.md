# Coastal Watch

Coastal Drone Surveillance console demo for Kerala Police, built with React, Vite, TypeScript and Tailwind CSS v4.

Read `AGENTS.md` and `docs/00_START_HERE.md` before making changes. The visual reference is `docs/reference/coastal-drone-mock.html`.

## Run locally

```sh
npm i
npm run dev
```

The app uses MSW fixture endpoints and a shared fake live-data emitter. No real authentication, video streams or production services are connected.

## Demo controls

- Sign in with the prefilled demo fields and choose a role. The form checks required fields and six verification digits; it does not authenticate against a server.
- Press **P** to toggle presenter mode. Use the left and right arrow keys, or select a step in the bottom bar, to navigate.
- Presenter shortcuts ignore editable fields, open dialogs and chart editing controls. Role permissions remain enforced.
- The **Alert raised** step raises the high alert immediately. Automatic alert delivery is suspended while presenter mode is enabled.
- Supervisors and administrators can choose **Reset demo** in the top bar. This clears session changes, audit records, local screen state and live-data timers, then returns to sign-in.
- Demo state is held in memory and does not survive a full reload.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
```

No test runner dependency is installed. Browser verification covers the demo flows, keyboard interactions, text contrast and responsive layouts at 1366px and 1920px.

## Project layout

- `src/app`: routes, providers, application shell and presenter controls.
- `src/features`: auth, watch floor, feed wall, incidents, zones and rules, models and health. Features expose public exports through `index.ts`.
- `src/components`, `src/hooks`, `src/lib`: reusable UI, data access and shared state.
- `src/mocks`: all demo fixtures, MSW handlers and simulation settings.

Use the existing tokens in `src/index.css`; do not change that file for screen work. Keep authored files below 200 lines. The generated `package-lock.json` is exempt from the line limit.
