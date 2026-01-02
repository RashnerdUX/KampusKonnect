// app/routes/auth.callback.tsx
import { redirect } from 'react-router'
import type { Route } from './+types/auth.callback'
import { createSupabaseServerClient } from '~/utils/supabase.server'

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  
  if (code) {
    const { supabase, headers } = createSupabaseServerClient(request)
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('OAuth error:', error)
      return redirect('/login?error=oauth_failed', { headers })
    }
    
    // Success! Redirect to dashboard
    // Check if the user is just registering for the first time
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return redirect('/login?error=no_user', { headers })
    }

    // Check if user has completed onboarding
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('onboarding_complete, role')
      .eq('id', user.id)
      .single()


    if (!profile || !profile.onboarding_complete) {
      return redirect('/onboarding/role', { headers });
    }

    // If user has completed onboarding and is a vendor, redirect to vendor dashboard
    if (!profile || profile.role === "vendor") {
      return redirect('/vendor', {headers});
    }
    
    return redirect('/marketplace', { headers })
  }
  
  // No code provided
  return redirect('/login?error=no_code')
}