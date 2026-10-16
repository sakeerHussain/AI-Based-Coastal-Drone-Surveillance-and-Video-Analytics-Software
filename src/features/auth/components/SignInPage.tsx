import { useNavigate } from 'react-router-dom'
import { mockUser } from '../../../mocks/auth'
import { useAuthStore } from '../hooks/useAuthStore'

export function SignInPage() {
  const signIn = useAuthStore((state) => state.signIn)
  const navigate = useNavigate()

  function handleContinue() {
    signIn(mockUser.role)
    navigate('/watch-floor')
  }

  return (
    <>
      Sign in
      <button
        type="button"
        onClick={handleContinue}
        className="ml-3 rounded border border-line bg-panel px-3 py-1 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea"
      >
        Continue
      </button>
    </>
  )
}
