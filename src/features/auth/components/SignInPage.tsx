import { SignInForm } from './SignInForm'
import { SignInChart } from './SignInChart'

export function SignInPage() {
  return <div className="grid min-h-full lg:h-full lg:grid-cols-[1.15fr_1fr]">
    <SignInChart />
    <div className="flex items-center justify-center p-8"><SignInForm /></div>
  </div>
}
