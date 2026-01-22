import React, {useState} from 'react'
import type { Route } from './+types/register';
import { Form, Link, redirect, useNavigation } from 'react-router';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import AuthFormDivider from '~/components/utility/AuthFormDivider';
import ImageCarousel from '~/components/auth/ImageCarousel';
import { handleGoogleLogin } from '~/utils/social_login';
import ThemeToggle from '~/components/ThemeToggle';
import { ButtonSpinner } from '~/components/ButtonSpinner';
import { getOptionalAuth } from '~/utils/optionalAuth.server';


export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "Register - Campex" }, 
    { name: "description", content: "Create a Campex account to connect with campus vendors near you." }
  ];
};

export const loader = async ({request}: Route.LoaderArgs) => {
  // Check if user is already signed in and redirect to marketplace

  const { user } = await getOptionalAuth(request);

  if (user){
    return redirect("/marketplace")
  }
}

export async function action({ request} : Route.ActionArgs) {

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceKey) {
    console.error("Missing Supabase service role key in environment variables.");
    return { error: "Internal server error. Please try again later." };
  }

  // Create the client with Service Role Key for Admin privileges
  const {supabase} = createSupabaseServerClient(request, serviceKey);


  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirm_password = formData.get("confirm_password")
  const surname = formData.get("surname");
  const first_name = formData.get("first_name");
  const username = formData.get("username");
  const agreeToTerms = formData.get("terms")

  // Check if user is signing up from a different route
  const whatsappUrl = formData.get("redirectTo") as string;

  if (whatsappUrl){
    console.log("Registering user from a different route other than Register")

    const { data, error } = await supabase.auth.signUp({ 
        email: String(email), 
        password: String(password),
    });

    if (error) {
        console.error("Error during registration:", error);
        return { error: error.message };
    }

    console.log("User is registered. Redirecting to WhatsApp")
    return redirect(whatsappUrl);
  }

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

    const user = data.user;

    if (user?.confirmed_at){
      return redirect('/login');
    }

    // TODO: Change this once we figure out why confirmation emails from Supabase keep failing
  return redirect('/onboarding/check-email');
}

export default function Register({actionData}: Route.ComponentProps){

  const [isGoogleSignIn, setIsGoogleSignIn] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasUserCheckedTerms, setHasUserCheckedTerms] = useState<boolean>(true);

  const hasUserCheckedTermsandConditions = () => {
    console.log("User has checked Terms and Conditions");
    setHasUserCheckedTerms(false);
  }

  const registerWithGoogle = async () => {
   const success = await handleGoogleLogin();
   setIsGoogleSignIn(true);
   if(success){
    setIsGoogleSignIn(success);
   };
    console.log("Google registration completed");
  }

  const navigation = useNavigation();
  if (navigation.state === 'submitting' && !isSubmitting || isGoogleSignIn) {
    setIsSubmitting(true);
  } else if (navigation.state === "idle" && isSubmitting ) {
    setIsSubmitting(false);
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
                          <input className="h-4 w-4 rounded border-border text-primary focus:ring-primary" id="terms" name='terms' type="checkbox" disabled={hasUserCheckedTerms} />
                          <label className="text-sm text-foreground/80" htmlFor="terms">I agree with the <a className="font-medium text-foreground/80 hover:text-primary underline" href="/legal/terms" target="_blank" onClick={hasUserCheckedTermsandConditions}>Terms &amp; Condition</a></label>
                        </div>
                        <button type="submit" className={`auth-button ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {isSubmitting && <ButtonSpinner />}
                          {isSubmitting ? 'Registering...' : 'Register'}
                        </button>
                        <p className="mt-2 text-center text-sm text-foreground/80">
                          Already have an account? 
                          <Link to="/login" className="ml-1 font-medium text-foreground/80 hover:text-primary transition-colors duration-200">Login here</Link>
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

      {/* Theme toggle fixed to the bottom right */}
      <div className='absolute bottom-4 right-4'>
        <ThemeToggle />
      </div>
    </div>
  )
}
