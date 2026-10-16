import { createBrowserRouter, Navigate } from 'react-router-dom'
import { SignInPage } from '../features/auth'
import { WatchFloorPage } from '../features/watch-floor'
import { FeedWallPage } from '../features/feed-wall'
import { IncidentReviewPage } from '../features/incidents'
import { ZonesAndRulesPage } from '../features/zones-rules'
import { ModelsAndHealthPage } from '../features/models'
import { AppShell } from './layout/AppShell'
import { RequirePermission } from './layout/RequirePermission'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/sign-in" replace /> },
  { path: '/sign-in', element: <SignInPage /> },
  {
    element: <AppShell />,
    children: [
      { path: '/watch-floor', element: <RequirePermission action="view:watch-floor"><WatchFloorPage /></RequirePermission> },
      { path: '/feed-wall', element: <RequirePermission action="view:feed-wall"><FeedWallPage /></RequirePermission> },
      { path: '/incidents', element: <RequirePermission action="view:incidents"><IncidentReviewPage /></RequirePermission> },
      { path: '/zones-rules', element: <RequirePermission action="view:zones-rules"><ZonesAndRulesPage /></RequirePermission> },
      { path: '/models', element: <RequirePermission action="view:models"><ModelsAndHealthPage /></RequirePermission> },
    ],
  },
])
