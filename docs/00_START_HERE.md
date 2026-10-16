# Coastal Drone Surveillance: Project Source of Truth
Kerala Police (Coastal) via KSUM. Bidder: FIST Innovations. Mock built for the technical presentation.
Read this first. If any other file disagrees with this one, this one wins.

## 1. Scope in one line
Web console that turns live and recorded drone video + telemetry into GPS-tagged AI alerts, with RBAC, audit and evidence handling. Minimum 20 concurrent feeds.

## 2. Screen inventory (RFP section 6, 7, 8, 10, 11, 16)
| # | Screen | Purpose | In mock? |
|---|--------|---------|----------|
| 1 | Sign in | Auth, role, second factor | Yes |
| 2 | Watch floor | Chart + live feed + telemetry + alert queue | Yes |
| 3 | Feed wall | Multi-feed monitoring (3x3, 2x2, 1x1) | Yes |
| 4 | Incident review | Evidence, playback, actions, audit | Yes |
| 5 | Zones and rules | Geofences, no-code alert rules | Yes |
| 6 | Models and health | Model registry, approvals, system health | Yes |
| 7 | Archive and playback | Search and filter historical events, clips | Listed only |
| 8 | Reports and analytics | Event trends, exports | Listed only |
| 9 | Drone fleet and missions | Drone list, flight logs, link status | Listed only |
| 10 | Users, roles, audit log | RBAC admin, audit search | Listed only |
| 11 | Dataset and annotation | Upload, label, class requests | Listed only |
| 12 | Integrations | API keys, C2 and GIS connectors | Listed only |
| 13 | Settings and notifications | Channels, escalation chains | Listed only |

## 3. Frontend architecture (decided)
Stack: React + Vite + TypeScript, Tailwind CSS, TanStack Query (server data), Zustand (live UI state), React Router, MapLibre GL (map; GeoConsole supplies tiles and layers), hls.js / WebRTC player, Vitest + Playwright.
Pattern: feature-first (Bulletproof React). Cross-feature imports are banned; shared code goes to `components/`, `hooks/`, `lib/`.
```
src/
  app/            router, providers, layout shell
  components/     generic UI only (Button, Table, Dialog, Badge, Toast)
  features/
    auth/  watch-floor/  feed-wall/  incidents/  zones-rules/
    models/  archive/  reports/  fleet/  admin/  integrations/
      (each: api/ components/ hooks/ types.ts index.ts)
  lib/            apiClient, ws client, formatters, permissions
  styles/         index.css holds Tailwind v4 @theme tokens
  mocks/          fixture data (MSW)
```
Rules: each feature exposes only through `index.ts`. Live data (alerts, telemetry) comes over WebSocket into a Zustand store; everything else through TanStack Query. Permissions checked by one `can(user, action)` helper.

## 4. Design tokens (do not invent new ones)
Colours: paper #F1F4F2, panel #FFFFFF, ink #10283A, mute #5B7080, line #D3DDDD, shoal #CFE3E6, sea #1F5C73, land #E7E2D0, alert red #C9382C, amber #C98F0E, green #2E8B6A.
Type: Hanken Grotesk, tabular numerals. Sentence case everywhere. No all-caps labels, no mono labels.
Look: nautical chart. Severity shown by a left bar, not by coloured cards. Rules written as sentences with inline selects.
Avoid: gradient washes, identical rounded card grids, glow, emoji, "AI sparkle" icons.

## 5. Discrepancies to fix before the presentation
- RFP section 14 asks for minimum THREE years support; proposal says ONE year. Align or explain.
- Proposal lists GeoConsole as the GIS; the mock draws its own chart. State that GeoConsole supplies layers in the real build.

## 6. Add-on features to pitch
1. Sealed evidence packs (SHA-256 manifest, chain of custody log).
2. Rule replay: test a new rule on last 7 days of footage before saving.
3. Sentence-style no-code rules.
4. Patrol boat dispatch request from an alert.
5. Vessel registry match (boat registration vs detected vessel), flags unregistered.
6. Weather and tide overlay on the chart.
7. Link-loss and low-battery warnings with return-to-home advice.
8. Shift handover brief: open incidents, auto summary.
9. Malayalam interface and alert text.
10. Edge inference option for weak links (already in the proposal stack).
11. Privacy masking of faces outside zones.
12. Offline-tolerant tablet view for field officers.
