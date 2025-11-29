import { createSupabaseServerClient } from "./supabase.server";

export async function getOptionalAuth(request: Request) {
  const { supabase, headers } = createSupabaseServerClient(request)
  
//   For optional auth, use getSession()
  const { data: { session } } = await supabase.auth.getSession()
  
  return {
    session,
    user: session?.user ?? null,
    supabase,
    headers,
    isAuthenticated: !!session,
  }
}