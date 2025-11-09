import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import type { Database } from './database.types';

export function createSupabaseServerClient(request: Request, service_key?: string) {
  // Create the headers object to capture Set-Cookie headers
  const headers = new Headers()

  // Set the environment variables
  const SUPABASE_URL = process.env.SUPABASE_URL!;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables for server initialization.");
  }

  if (service_key) {
    console.log("Using service key for Supabase client. To ensure security, do not expose this key to the client.");
  }

  const supabase = createServerClient<Database>(
    SUPABASE_URL!,
    service_key || SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '')
            .map(cookie => ({
              name: cookie.name,
              value: cookie.value ?? ''
            }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append('Set-Cookie', serializeCookieHeader(name, value, options))
          )
        },
      },
    }
  )
  
  return { supabase, headers }
}