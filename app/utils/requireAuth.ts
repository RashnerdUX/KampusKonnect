import { redirect } from "react-router";
import { createSupabaseServerClient } from "./supabase.server";

export async function requireAuth (request: Request) {

    // Get the Supabase client
    const { supabase, headers } = createSupabaseServerClient(request);

    //   Get the current session from Supabase
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        const url = new URL(request.url);
        url.pathname = "/login";
        throw redirect(url.toString());
    }

    // For debugging purposes
    console.log("Here's the authenticated: ", user);

    return { user: user}
}