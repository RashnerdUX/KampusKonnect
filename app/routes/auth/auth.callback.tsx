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
    return redirect('/app', { headers })
  }
  
  // No code provided
  return redirect('/login?error=no_code')
}