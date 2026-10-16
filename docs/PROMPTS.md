# Prompts for Codex (run in order, one per session, commit after each)

Put `coastal-drone-mock.html` in docs/reference/, and 00_START_HERE.md in docs/. Put AGENTS.md at repo root.

## P0 Scaffold

Read AGENTS.md and docs/00_START_HERE.md. Scaffold the Vite + React + TypeScript + Tailwind project with the folder layout in section 3, tokens from section 4, router with one placeholder route per screen, and MSW set up. Do not build screens yet. Show me the file tree when done. This project uses Tailwind v4 with the @tailwindcss/vite plugin. Tokens are already in src/index.css under @theme. Do not add a Tailwind config file.

## P1 App shell

Using docs/reference/coastal-drone-mock.html as the visual reference, build the app shell: left navigation, top bar, role badge, feed status. Role comes from a mock auth store. Nav items hidden by `can()`.

## P2 Watch floor

Build features/watch-floor: MapLibre chart panel (use a static style for now), live feed panel with telemetry strip, alert queue. Alerts arrive from a fake WebSocket emitting one alert every 20 s. Match the mock.

## P3 Incident review

Build features/incidents: video player with event timeline, facts list, evidence hash panel, action buttons that append to an audit list.

## P4 Zones and rules

Build features/zones-rules: zone list, polygon edit on the map, and the sentence-style rule editor. Validate with zod. Save to mock API.

## P5 Feed wall, models and health

Build features/feed-wall and features/models from the mock.

## P6 Review pass

Review the repo against AGENTS.md. List violations only (cross-feature imports, hardcoded data, token misuse, files over 200 lines). Fix them, then run the checks.

## Tips

- One screen per session keeps context small and output accurate.
- Paste the exact RFP section number when a feature depends on it.
- If output drifts, reply: "Re-read AGENTS.md and docs/00_START_HERE.md, then redo only <file>."


