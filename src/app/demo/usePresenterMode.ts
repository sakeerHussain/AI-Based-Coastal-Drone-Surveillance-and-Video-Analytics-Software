import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../features/auth'
import { useDemoStore } from '../../lib/useDemoStore'
import { liveDataClient } from '../../lib/liveDataClient'
import { can } from '../../lib/permissions'
import { demoSteps } from '../../mocks/demo'
import { mockUser } from '../../mocks/auth'

export function usePresenterMode() {
  const navigate = useNavigate()
  const location = useLocation()
  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= demoSteps.length) return
    const target = demoSteps[index]
    if (index > 0 && !useAuthStore.getState().user) useAuthStore.getState().signIn(mockUser.role)
    if (target.action && !can(useAuthStore.getState().user, target.action)) {
      useDemoStore.getState().setNotice('This step is unavailable for your role. Choose Supervisor or Administrator on the sign-in step.')
      return
    }
    useDemoStore.getState().setStep(index)
    if (index === 2) liveDataClient.raiseHighAlert()
    void navigate(target.path)
  }, [navigate])
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return
      const target = event.target
      if (document.querySelector('dialog[open]') || target instanceof Element && target.closest(
        'input,select,textarea,[contenteditable]:not([contenteditable="false"]),[role="textbox"],canvas,[data-corner]',
      )) return
      const state = useDemoStore.getState()
      if (event.key.toLowerCase() === 'p') {
        event.preventDefault()
        const enabled = !state.enabled
        state.setEnabled(enabled)
        liveDataClient.setAutomaticAlerts(!enabled)
        if (enabled) {
          const index = demoSteps.findIndex((step) => step.path === location.pathname)
          state.setStep(Math.max(0, index))
        }
      } else if (state.enabled && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
        event.preventDefault()
        goTo(state.step + (event.key === 'ArrowRight' ? 1 : -1))
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goTo, location.pathname])
  return goTo
}
