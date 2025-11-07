import React from 'react'
import type { Route } from './+types/login';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { redirect, Form } from 'react-router';

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "Login - Kampus Konnect" }, 
    { name: "description", content: "Log in to your Kampus Konnect account to connect with campus vendors near you." }
  ];
}

export async function action({ request} : Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

    // Get the supabase client
    const { supabase, headers } = createSupabaseServerClient(request);

    // Perform the login here
    const { data, error} = await supabase.auth.signInWithPassword(
        { 
            email: String(email), 
            password: String(password) 
        }
    )

    if (error) {
        console.error("Error during login:", error);
        return { error: error.message };
    }

    console.log("Login successful:", data);
  return redirect("/playground", { headers });
}

export default function Login() {
  return (
    <div>
        <Form method='post'>
            <div>
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </div>
        </Form>
    </div>
  )
}