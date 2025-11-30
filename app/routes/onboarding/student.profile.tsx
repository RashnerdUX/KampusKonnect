import React from 'react'
import { Form, Link } from 'react-router'
import { FaArrowLeft, FaArrowRight, FaUser } from 'react-icons/fa'

export const meta = () => {
  return [
    { title: 'Complete Your Profile - Kampus Konnect' },
    { name: 'description', content: 'Tell us a bit about yourself to personalize your experience.' },
  ]
}

export const action = async () => {
  // TODO: Save student profile to database
  return null
}

export default function StudentProfile() {
  return (
    <div className="w-full max-w-2xl">
      {/* Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
            <FaUser className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
            <p className="text-sm text-foreground/70">Tell us a bit about yourself</p>
          </div>
        </div>

        {/* Form */}
        <Form method="post" className="flex flex-col gap-5">
          {/* Name Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Surname <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="surname"
                placeholder="Enter your surname"
                required
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                First Name <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                required
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>

          {/* University */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">
              University <span className="text-red-500">*</span>
            </span>
            <select
              name="university"
              required
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select your university</option>
              <option value="unilag">University of Lagos</option>
              <option value="ui">University of Ibadan</option>
              <option value="oau">Obafemi Awolowo University</option>
              <option value="unn">University of Nigeria, Nsukka</option>
              <option value="abu">Ahmadu Bello University</option>
              <option value="other">Other</option>
            </select>
          </label>

          {/* Department */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">
              Department <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="department"
              placeholder="e.g. Computer Science"
              required
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          {/* Level */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">
              Level <span className="text-red-500">*</span>
            </span>
            <select
              name="level"
              required
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select your level</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
              <option value="500">500 Level</option>
              <option value="postgrad">Postgraduate</option>
            </select>
          </label>

          {/* WhatsApp */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">
              WhatsApp Number <span className="text-red-500">*</span>
            </span>
            <input
              type="tel"
              name="whatsapp"
              placeholder="+234 800 000 0000"
              required
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-xs text-foreground/60">
              Vendors may contact you via WhatsApp for orders
            </span>
          </label>

          {/* Gender */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Gender</span>
            <select
              name="gender"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>

          {/* Actions */}
          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Link
              to="/onboarding/role"
              className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 font-medium text-foreground transition hover:bg-muted"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Continue
              <FaArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}
