import React from 'react'
import { Form, Link } from 'react-router'
import { FaArrowLeft, FaArrowRight, FaStore } from 'react-icons/fa'

export const meta = () => {
  return [
    { title: 'Vendor Profile - Kampus Konnect' },
    { name: 'description', content: 'Complete your vendor profile to get started.' },
  ]
}

export const action = async () => {
  // TODO: Save vendor profile to database
  return null
}

export default function VendorProfile() {
  return (
    <div className="w-full max-w-2xl">
      {/* Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400">
            <FaStore className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Vendor Profile</h1>
            <p className="text-sm text-foreground/70">Tell us about yourself</p>
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

          {/* Email (readonly, from auth) */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Email</span>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              disabled
              className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground/60"
            />
            <span className="text-xs text-foreground/60">Email from your registration</span>
          </label>

          {/* Phone */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">
              Phone Number <span className="text-red-500">*</span>
            </span>
            <input
              type="tel"
              name="phone"
              placeholder="+234 800 000 0000"
              required
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
              Customers will contact you via WhatsApp
            </span>
          </label>

          {/* Location */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">
              Primary Location <span className="text-red-500">*</span>
            </span>
            <select
              name="location"
              required
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select your primary campus</option>
              <option value="unilag">University of Lagos</option>
              <option value="ui">University of Ibadan</option>
              <option value="oau">Obafemi Awolowo University</option>
              <option value="unn">University of Nigeria, Nsukka</option>
              <option value="abu">Ahmadu Bello University</option>
              <option value="multiple">Multiple Locations</option>
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
