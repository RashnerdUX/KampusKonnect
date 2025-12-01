import React from 'react'
import { Outlet, useLocation, data } from 'react-router'
import type { Route } from '../onboarding/+types/_layout'
import { requireAuth } from '~/utils/requireAuth'

const ONBOARDING_STEPS = [
  { path: '/onboarding/role', label: 'Choose Role' },
  { path: '/onboarding/profile', label: 'Your Profile' },
  { path: '/onboarding/complete', label: 'Complete' },
]

export const meta = () => {
  return [
    { title: 'Onboarding - Kampus Konnect' },
    { name: 'description', content: 'Complete your profile to get started.' },
  ]
}

export async function loader({request}: Route.LoaderArgs){
    const { user, headers} = await requireAuth(request);
    return data({ user }, { headers: headers });
}

export default function OnboardingLayout() {
  const location = useLocation()

  // Determine current step based on pathname
  const getCurrentStep = () => {
    const path = location.pathname
    if (path.includes('/role')) return 0
    if (path.includes('/profile') || path.includes('/interests') || path.includes('/store')) return 1
    if (path.includes('/complete')) return 2
    return 0
  }

  const currentStep = getCurrentStep()

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Header with logo and progress */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo/logo.svg" alt="Kampus Konnect" className="h-8 w-8" />
            <span className="text-lg font-bold text-foreground">Campex</span>
          </div>

          {/* Progress indicator */}
          <div className="hidden items-center gap-2 sm:flex">
            {ONBOARDING_STEPS.map((step, index) => (
              <React.Fragment key={step.path}>
                {/* Step indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      index < currentStep
                        ? 'bg-primary text-primary-foreground'
                        : index === currentStep
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground/50'
                    }`}
                  >
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span
                    className={`hidden text-sm font-medium md:block ${
                      index <= currentStep ? 'text-foreground' : 'text-foreground/50'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector */}
                {index < ONBOARDING_STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-8 transition-colors ${
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile progress */}
          <div className="flex items-center gap-2 sm:hidden">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-4 text-center text-sm text-foreground/60">
        <p>Need help? Contact us at info@shopwithcampex.com</p>
      </footer>
    </div>
  )
}
