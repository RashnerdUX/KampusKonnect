import React from 'react'
import type { Route } from './+types/student.profile';
import { Form, Link, data, redirect } from 'react-router'
import { FaArrowLeft, FaArrowRight, FaUser } from 'react-icons/fa'
import { createSupabaseServerClient } from '~/utils/supabase.server'
import { requireAuth } from '~/utils/requireAuth'

export const meta = () => {
  return [
    { title: 'Complete Your Profile - Campex' },
    { name: 'description', content: 'Tell us a bit about yourself to personalize your experience.' },
  ]
}

export const action = async ({ request }: Route.ActionArgs) => {
      const formData = await request.formData();
    // Get all data provided from the form
    const surname = formData.get("surname") as string;
    const firstName = formData.get("firstName") as string;
    const phone = formData.get("phone") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const university = formData.get("university") as string;


    const { supabase, headers } = createSupabaseServerClient(request);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login", { headers });
    }

    // Update the vendor profile in the database
    console.log("Updating the user profile now");

    const { data, error } = await supabase
        .from('user_profiles')
        .update({
            surname: surname,
            first_name: firstName,
            phone_number: phone,
            whatsapp_number: whatsapp,
            university_id: university,
        })
        .eq('id', user.id)
        .select()

    if (error) {
        console.error("Error updating vendor profile:", error);
        return redirect("/onboarding/vendor/profile", { headers  });
    }        
  
    console.log("Updated the User profile")
  return redirect("/onboarding/student/interests", { headers  });
}

export const loader = async ({ request }: Route.LoaderArgs) => {
    // Get default data
    const { user, headers} = await requireAuth(request); 
    const userEmail = user.email;
    const firstName = user.user_metadata.first_name;
    const surname = user.user_metadata.surname;
    
    const {supabase} = createSupabaseServerClient(request);
    
    // Get the list of universities
    const { data: universities, error } = await supabase
            .from('universities')
            .select('id, name');
    
    if (error) {
        console.error("Error fetching universities:", error);
    }
        
    return data({ userEmail, firstName, surname, universities: universities ?? [] }, { headers: headers });
}

export default function StudentProfile({loaderData}:Route.ComponentProps) {

    const { userEmail, firstName, surname, universities } = loaderData;

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
                defaultValue={surname}
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
                defaultValue={firstName}
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
                {universities.map((university: {id: string, name: string}) => (
                  <option key={university.id} value={university.id}>
                    {university.name}
                  </option>
                ))}
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
