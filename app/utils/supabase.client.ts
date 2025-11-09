import { createBrowserClient } from '@supabase/ssr'
    

export function createSupabaseClient() {

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Missing Supabase environment variables for Client initialization');
    }

  return createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  )
}