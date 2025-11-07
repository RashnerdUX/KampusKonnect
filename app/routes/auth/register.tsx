import React from 'react'
import type { Route } from './+types/register';
import { Form, redirect } from 'react-router';
import { getServerSupabase } from '~/utils/supabase.server';

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "Register - Kampus Konnect" }, 
    { name: "description", content: "Create a Kampus Konnect account to connect with campus vendors near you." }
  ];
};

export async function action({ request} : Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  //Import supabase client
  const response = new Response();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log("Service Key:", serviceKey);
  const supabase = getServerSupabase(request, response, serviceKey);
    //   Sign up with Supabase
    console.log("Registering user:", email);
    const { data, error } = await supabase.auth.signUp({ 
        email: String(email), 
        password: String(password),
        options: {
            data: {
                username: "Admin Trial",
                surname: "Akhigbe",
                first_name: "Adeseye",
            }
        }
    });

    if (error) {
        console.error("Error during registration:", error);
        return { error: error.message };
    }

  return redirect('/login');
}

export default function Register({actionData}: Route.ComponentProps){
  return (
    <div>
        <Form method='post'>
            <div>
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Register</button>
            </div>
        </Form>
    </div>
  )
}
