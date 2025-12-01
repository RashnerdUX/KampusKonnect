import React, { useEffect, useState } from 'react'
import type { Route } from './+types/onboarding.complete'
import { redirect, useNavigate } from 'react-router'
import { createSupabaseServerClient } from '~/utils/supabase.server'
import { FaCheckCircle } from 'react-icons/fa'

export const meta = () => {
  return [
    { title: 'Onboarding Complete - Campex' },
    { name: 'description', content: 'Welcome to Campex! Your onboarding is complete.' },
  ]
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, headers } = createSupabaseServerClient(request)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login', { headers })
  }

  // Get user profile to check role and current onboarding status
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role, onboarding_complete, first_name')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Error fetching profile:', profileError)
    return redirect('/onboarding/role', { headers })
  }

  // If already completed, redirect to appropriate dashboard
  if (profile.onboarding_complete) {
    if (profile.role === 'vendor') {
      return redirect('/vendor', { headers })
    }
    return redirect('/marketplace', { headers })
  }

  // Mark onboarding as complete
  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({ onboarding_complete: true })
    .eq('id', user.id)

  if (updateError) {
    console.error('Error updating onboarding status:', updateError)
  }

  return {
    firstName: profile.first_name,
    role: profile.role as 'student' | 'vendor',
  }
}

export const OnboardingComplete = ({ loaderData }: Route.ComponentProps) => {
  const { firstName, role } = loaderData ?? { firstName: 'there', role: 'student' }
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)

  const redirectPath = role === 'vendor' ? '/vendor' : '/marketplace'

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Redirect after 5 seconds
    const timeout = setTimeout(() => {
      navigate(redirectPath)
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [navigate, redirectPath])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        {/* Success Icon */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <FaCheckCircle className="h-12 w-12 text-green-500" />
        </div>

        {/* Welcome Message */}
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Welcome to Campex, {firstName}! 🎉
        </h1>
        <p className="mb-6 text-lg text-foreground/70">
          Your account has been set up successfully. You're all ready to{' '}
          {role === 'vendor'
            ? 'start managing your store and selling products!'
            : 'explore the marketplace and discover amazing products!'}
        </p>

        {/* Redirect Notice */}
        <div className="mb-8 rounded-xl bg-muted p-4">
          <p className="text-foreground/80">
            You'll be redirected to your{' '}
            <span className="font-semibold">
              {role === 'vendor' ? 'Vendor Dashboard' : 'Marketplace'}
            </span>{' '}
            in{' '}
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {countdown}
            </span>{' '}
            seconds...
          </p>
        </div>

        {/* Manual Navigation Button */}
        <button
          onClick={() => navigate(redirectPath)}
          className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          {role === 'vendor' ? 'Go to Dashboard Now' : 'Explore Marketplace Now'}
        </button>

        {/* Progress indicator */}
        <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default OnboardingComplete
