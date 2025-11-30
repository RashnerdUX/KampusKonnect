import React from 'react'
import { Link } from 'react-router'
import { FaEnvelope, FaArrowLeft, FaRedo } from 'react-icons/fa'

export const meta = () => {
  return [
    { title: 'Check Your Email - Kampus Konnect' },
    { name: 'description', content: 'Please verify your email address to continue.' },
  ]
}

export default function CheckEmail() {
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
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <FaRedo className="h-4 w-4" />
              Resend Verification Email
            </button>

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
