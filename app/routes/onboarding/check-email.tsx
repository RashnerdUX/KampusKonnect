import React, { useEffect, useState } from 'react'
import type { Route } from './+types/check-email';
import { Link, Form, redirect, useActionData, useNavigation } from 'react-router'
import { FaEnvelope, FaArrowLeft, FaRedo, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { createSupabaseServerClient } from '~/utils/supabase.server'

export const meta = () => {
  return [
    { title: 'Check Your Email - Campex' },
    { name: 'description', content: 'Please verify your email address to continue.' },
  ]
}

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase } = createSupabaseServerClient(request)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email!
  })

  if (error) {
    console.error("Error resending verification email:", error)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

export default function CheckEmail() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  // Auto-hide success message after 5 seconds
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    if (actionData) {
      setShowMessage(true)
      const timer = setTimeout(() => setShowMessage(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [actionData])

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <FaEnvelope className="h-10 w-10 text-primary" />
          </div>

          {/* Heading */}
          <h1 className="mb-2 text-center text-2xl font-bold text-foreground">
            Check Your Email
          </h1>
          <p className="mb-6 text-center text-foreground/70">
            We've sent a verification link to your email address. Please click the link to verify your account and continue.
          </p>

          {/* Success/Error Message */}
          {showMessage && actionData && (
            <div
              className={`mb-4 flex items-center gap-3 rounded-xl p-4 ${
                actionData.success
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {actionData.success ? (
                <>
                  <FaCheckCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    Verification email sent! Please check your inbox.
                  </p>
                </>
              ) : (
                <>
                  <FaExclamationCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    {actionData.error || 'Failed to resend email. Please try again.'}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mb-6 rounded-xl bg-muted/50 p-4">
            <h2 className="mb-2 text-sm font-semibold text-foreground">
              Didn't receive the email?
            </h2>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email</li>
              <li>• Wait a few minutes and try again</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Form method="post">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaRedo className="h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </button>
            </Form>

            <Link
              to="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 font-medium text-foreground transition hover:bg-muted"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-foreground/60">
          Already verified?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
