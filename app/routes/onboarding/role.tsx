import React from 'react'
import type { Route } from './+types/role'
import { redirect, Form } from 'react-router'
import { FaGraduationCap, FaStore, FaArrowRight } from 'react-icons/fa'
import { createSupabaseServerClient } from '~/utils/supabase.server'

export const meta = () => {
  return [
    { title: 'Choose Your Role - Kampus Konnect' },
    { name: 'description', content: 'Continue as a student or vendor on Kampus Konnect.' },
  ]
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const role = formData.get('role') as string

  console.log('Here\'s the selected role:', role)

  if (role !== 'student' && role !== 'vendor') {
    console.error('Invalid role selected:', role)
    return redirect('/onboarding/role')
  }

  const { supabase, headers } = createSupabaseServerClient(request)
  const { data: { user } } = await supabase.auth.getUser()

    // If the user isn't logged in, refer to login
  if (!user) {
    return redirect('/login', { headers })
  }

  // Update the user role in the database
  const { error } = await supabase
    .from('user_profiles')
    .update({ role: role })
    .eq('id', user.id)

    console.log("Updated the student's role to this", role)
    
    if (error) {
        console.error('Error updating user role:', error)
        return redirect('/onboarding/role', { headers })
    }

  if (role === 'student') {
    return redirect('/onboarding/student/profile', { headers })
  } else if (role === 'vendor') {
    return redirect('/onboarding/vendor/profile', { headers })
  }
}

interface RoleCardProps {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
  variant: 'student' | 'vendor'
}

const RoleCard = ({ icon, title, description, features, variant }: RoleCardProps) => {
  const isStudent = variant === 'student'

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-card p-6 text-left transition-all hover:shadow-xl ${
        isStudent
          ? 'border-blue-200 hover:border-blue-400 dark:border-blue-800 dark:hover:border-blue-600'
          : 'border-orange-200 hover:border-orange-400 dark:border-orange-800 dark:hover:border-orange-600'
      }`}
    >
      {/* Background gradient on hover */}
      <div
        className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${
          isStudent
            ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30'
            : 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30'
        }`}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/* Icon */}
        <div
          className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
            isStudent
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
              : 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400'
          }`}
        >
          {icon}
        </div>

        {/* Title & Description */}
        <h2 className="mb-2 text-xl font-bold text-foreground">{title}</h2>
        <p className="mb-4 text-sm text-foreground/70">{description}</p>

        {/* Features */}
        <ul className="mb-6 flex-1 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-foreground/80">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isStudent ? 'bg-blue-500' : 'bg-orange-500'
                }`}
              />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div
          className={`flex items-center gap-2 font-semibold transition-transform group-hover:translate-x-1 ${
            isStudent ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
          }`}
        >
          Continue as {title}
          <FaArrowRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}

export default function RoleSelection() {
  return (
    <div className="w-full max-w-3xl">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Welcome to Campex!</h1>
        <p className="text-lg text-foreground/70">How would you like to use the platform?</p>
      </div>

      {/* Role Cards */}
      <Form method="post">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <button
            type="submit"
            name="role"
            value="student"
            className="h-full w-full cursor-pointer"
          >
            <RoleCard
              icon={<FaGraduationCap className="h-8 w-8" />}
              title="Student"
              description="Discover products and services from campus vendors."
              features={[
                'Browse products from verified vendors',
                'Get exclusive student discounts',
                'Connect with campus businesses',
                'Save favorites and track orders',
              ]}
              variant="student"
            />
          </button>

          <button
            type="submit"
            name="role"
            value="vendor"
            className="h-full w-full cursor-pointer"
          >
            <RoleCard
              icon={<FaStore className="h-8 w-8" />}
              title="Vendor"
              description="Sell your products and services to campus students."
              features={[
                'Create your online store',
                'Reach thousands of students',
                'Manage products and orders',
                'Get verified seller badge',
              ]}
              variant="vendor"
            />
          </button>
        </div>
      </Form>

      {/* Note */}
      <p className="mt-8 text-center text-sm text-foreground/60">
        You can always switch or add roles later in your account settings.
      </p>
    </div>
  )
}
