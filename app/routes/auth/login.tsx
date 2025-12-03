import React from 'react'
import type { Route } from './+types/login';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { redirect, Form, Link, data } from 'react-router';

// Component imports
import ImageCarousel from '~/components/auth/ImageCarousel';
import AuthFormDivider from '~/components/utility/AuthFormDivider';
import { handleGoogleLogin } from '~/utils/social_login';

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "Login - Campex" }, 
    { name: "description", content: "Log in to your Campex account to connect with campus vendors near you." }
  ];
}

export async function action({ request} : Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

    // Get the supabase client
    const { supabase, headers } = createSupabaseServerClient(request);

    // Perform the login here
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword(
        { 
            email: email as string, 
            password: password as string 
        }
    )

    if (loginError) {
        console.error("Error during login:", loginError);
        return data({ error: loginError.message }, { headers });
    }

    // Check if the user has completed onboarding. Use the user retrieved from loginData
    const user = loginData.user;

    console.log("Login successful:", loginData);
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('onboarding_complete, role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return redirect('/onboarding/role', { headers });
    }

    if (profile.onboarding_complete === false) {
      return redirect('/onboarding/role', { headers });
    }

    if (profile.role === 'vendor') {
      return redirect('/vendor', { headers });
    }

  return redirect("/marketplace", { headers });
}

export default function Login({actionData}:Route.ComponentProps) {

  const loginWithGoogle = async () => {
    const success = await handleGoogleLogin();

    if (success) {
      console.log("Signed In with Google")
    }
  }

  return (
<div className='relative min-h-screen flex flex-col md:m-auto items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-primary/5 via-background to-primary/10'>
      <main className='w-full max-w-6xl'>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 rounded-xl overflow-hidden shadow-lg px-10 py-6">
              <div className="hidden lg:block relative">
                <img src="/images/find-vendors.jpg" alt="Login Illustration" className="rounded-xl h-auto max-h-[80vh] w-full object-cover" />
                <div className="absolute bottom-4 left-4 text-white p-4 rounded-md max-w-sm">
                  <h2 className="text-4xl font-semibold">Welcome to Campex</h2>
                  <p className="text-sm mt-1">Easily find and connect with trusted vendors on your campus.</p>
                </div>
              </div>
            <div className='flex flex-col'>
              {/* The Registration Form */}
              <div className='flex flex-col items-center justify-center mb-4'>
                <img src="/logo/logo.svg" alt="Campex Logo" className="h-16 w-16 mr-1" />
                <h1 className='text-3xl font-black lg:text-4xl text-center'>Log In to Your Account</h1>
              </div>
              <div>
                <Form method='post'>
                    <div className='flex flex-col'>
                      {actionData?.error && <p className="text-red-500 text-sm text-center">{actionData.error}</p>}
                        <input type="email" name="email" placeholder="Email" required className='input-field'/>
                        <input type="password" name="password" placeholder="Password" required className='input-field'/>

                        {/* Remember Me  */}
                        <div className="flex items-center gap-3 pt-2">
                          <input className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" id="remember-me" type="checkbox"/>
                          <label className="text-sm text-gray-600 dark:text-gray-400" htmlFor="terms"> Remember me</label>
                        </div>

                        <button type="submit" className='auth-button'>Login</button>
                        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                          Don't have an account yet? 
                          <Link to="/register" className="ml-1 font-medium text-gray-900 dark:text-gray-200">Register here</Link>
                        </p>
                    </div>
                </Form>
                <div className="relative my-2 flex items-center">
                  {/* Divider component */} 
                  <AuthFormDivider />
                </div>
                <div>
                  {/* The Google Sign In button */}
                  <button className="social-auth-button" onClick={loginWithGoogle}>
                    <img src="/logo/google-logo.svg" alt="Google Logo" className="inline-block h-5 w-5 mr-2"/>
                    <span>Sign in with Google</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
      </main>
    </div>
  )
}
