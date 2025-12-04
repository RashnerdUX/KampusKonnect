import { createSupabaseServerClient } from "./supabase.server";

export async function getOptionalAuth(request: Request) {
  const { supabase, headers } = createSupabaseServerClient(request)
  
//   For optional auth, use getUser() for checking session without redirects
  const { data: { user } } = await supabase.auth.getUser()
  
  return {
    user,
    supabase,
    headers,
    isAuthenticated: !!user,
  }
}