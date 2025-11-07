import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export function getServerSupabase(request: Request, response: Response, supabase_service_role_key?: string) {
  const SUPABASE_URL = process.env.SUPABASE_URL!;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables.");
  }

  const supabase = createServerClient<Database>(
    SUPABASE_URL,
    supabase_service_role_key || SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => request.headers.get("cookie")?.match(new RegExp(`${name}=([^;]+)`))?.[1],
        set: (name, value, options) =>
          response.headers.append("Set-Cookie", `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Secure`),
        remove: (name, options) =>
          response.headers.append("Set-Cookie", `${name}=; Path=/; Max-Age=0; SameSite=Lax; Secure`),
      },
    }
  );

  return supabase;
}
