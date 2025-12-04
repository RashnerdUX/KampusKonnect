import { createSupabaseServerClient } from "./supabase.server";

export async function getOptionalAuth(request: Request) {
  const { supabase, headers } = createSupabaseServerClient(request)
  
//   For optional auth, use getSession()
  const { data: { user } } = await supabase.auth.getUser()
  
  return {
    user,
    supabase,
    headers,
    isAuthenticated: !!user,
  }
}