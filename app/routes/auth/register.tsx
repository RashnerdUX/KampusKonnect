import React, {useState} from 'react'
import type { Route } from './+types/register';
import { Form, Link, redirect } from 'react-router';
import { createSupabaseServerClient } from '~/utils/supabase.server';

import AuthFormDivider from '~/components/utility/AuthFormDivider';
import ImageCarousel from '~/components/auth/ImageCarousel';
import { handleGoogleLogin } from '~/utils/social_login';


export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "Register - Campex" }, 
    { name: "description", content: "Create a Campex account to connect with campus vendors near you." }
  ];
};

export async function action({ request} : Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirm_password = formData.get("confirm_password")
  const surname = formData.get("surname");
  const first_name = formData.get("first_name");
  const username = formData.get("username");
  const agreeToTerms = formData.get("terms")

  // Check to make sure user is entering same password
  if (password !== confirm_password){
    return { error: "Passwords must match"}
  }

  // Check that the user has agreed to the Terms and conditions
  if (agreeToTerms !== "on") {
    return { error: "You must agree to the terms and conditions" };
  }

  //Import supabase client
  // TODO: Try registering without service key and see if it has been fixed on Supabase's end
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceKey) {
    console.error("Missing Supabase service role key in environment variables.");
    return { error: "Internal server error. Please try again later." };
  }

  const {supabase} = createSupabaseServerClient(request, serviceKey);
    //   Sign up with Supabase
    console.log("Registering user:", email);
    const { data, error } = await supabase.auth.signUp({ 
        email: String(email), 
        password: String(password),
        options: {
            data: {
                username: String(username),
                surname: String(surname),
                first_name: String(first_name),
            },
            emailRedirectTo: `${new URL(request.url).origin}/auth/callback`,
        }
    });

    if (error) {
        console.error("Error during registration:", error);
        return { error: error.message };
    }

  return redirect('/onboarding/check-email');
}

export default function Register({actionData}: Route.ComponentProps){

  const [isGoogleSignIn, setIsGoogleSignIn] = useState<Boolean>(false);

  const registerWithGoogle = async () => {
   const success = await handleGoogleLogin();
   if(success){
    setIsGoogleSignIn(success);
   };
    console.log("Google registration completed");
  }

  return (
    <div className='relative max-h-dvh flex flex-col md:m-auto items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-primary/5 via-background to-primary/10'>
      <main className='w-full max-w-6xl'>
        <div className=''>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 rounded-xl overflow-hidden shadow-lg px-10 py-6">
              {/* The Image carousel */}
              <ImageCarousel />
            <div className='flex flex-col'>
              {/* The Registration Form */}
              <div className='flex flex-col items-center justify-center mb-4'>
                <img src="/logo/logo.svg" alt="Campex Logo" className="h-16 w-16 mr-1" />
                <h1 className='text-3xl font-black lg:text-4xl text-center'>Create Your Account</h1>
              </div>
              <div>
                <Form method='post'>
                    <div className='flex flex-col'>
                      {actionData?.error && <p className="text-red-500 text-sm text-center">{actionData.error}</p>}
                        <div className='flex flex-row gap-2'>
                          <input type="text" name="surname" placeholder="Surname" required className='input-field'/>
                          <input type="text" name="first_name" placeholder="First Name" required className='input-field'/>
                        </div>
                        <input type="text" name="username" placeholder="Username" required className='input-field'/>
                        <input type="email" name="email" placeholder="Email" required className='input-field'/>
                        <input type="password" name="password" placeholder="Password" required className='input-field'/>
                        <input type="password" name="confirm_password" placeholder="Confirm Password" required className='input-field' />

                        {/* Check Terms & Conditions */}
                        <div className="flex items-center gap-3 pt-2">
                          <input className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" id="terms" name='terms' type="checkbox"/>
                          <label className="text-sm text-gray-600 dark:text-gray-400" htmlFor="terms">I agree with the <a className="font-medium text-gray-900 dark:text-gray-200 hover:underline" href="#">Terms &amp; Condition</a></label>
                        </div>
                        <button type="submit" className='auth-button'>Register</button>
                        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                          Already have an account? 
                          <Link to="/login" className="ml-1 font-medium text-gray-900 dark:text-gray-200">Login here</Link>
                        </p>
                    </div>
                </Form>
                <div className="relative my-2 flex items-center">
                  {/* Divider component */} 
                  <AuthFormDivider />
                </div>
                <div>
                  {/* The Google Sign In button */}
                  <button className="social-auth-button" onClick={registerWithGoogle} >
                    <img src="/logo/google-logo.svg" alt="Google Logo" className="inline-block h-5 w-5 mr-2"/>
                    <span>Sign up with Google</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
