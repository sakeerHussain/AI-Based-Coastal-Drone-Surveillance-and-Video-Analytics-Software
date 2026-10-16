import { createBrowserRouter, Navigate } from 'react-router-dom'
import { SignInPage } from '../features/auth'
import { WatchFloorPage } from '../features/watch-floor'
import { FeedWallPage } from '../features/feed-wall'
import { IncidentReviewPage } from '../features/incidents'
import { ZonesAndRulesPage } from '../features/zones-rules'
import { ModelsAndHealthPage } from '../features/models'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/sign-in" replace /> },
  { path: '/sign-in', element: <SignInPage /> },
  { path: '/watch-floor', element: <WatchFloorPage /> },
  { path: '/feed-wall', element: <FeedWallPage /> },
  { path: '/incidents', element: <IncidentReviewPage /> },
  { path: '/zones-rules', element: <ZonesAndRulesPage /> },
  { path: '/models', element: <ModelsAndHealthPage /> },
])
