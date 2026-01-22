import { useNavigation, useActionData, Form } from "react-router";
import ButtonSpinner from "../ButtonSpinner";
import { handleGoogleLogin } from '~/utils/social_login';
import AuthFormDivider from "../utility/AuthFormDivider";

export interface RegistrationModalProps {
    onClose: () => void,
    redirectLink: string,

}

const RegistrationModal = ({onClose, redirectLink}: RegistrationModalProps) => {

    const navigation = useNavigation();
    const actionData = useActionData();

   
    const isSubmitting = navigation.state === "submitting" && 
                       navigation.formData?.get("_action") === "register";
    
    let isGoogleSignIn: boolean = false

    const registerWithGoogle = async () => {
       const success = await handleGoogleLogin();

       isGoogleSignIn = success
        console.log("Google registration completed");
    }

  return (
    <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">

            <div className="absolute inset-0" onClick={onClose} />
            
            <div className="bg-card py-4 px-2 lg:p-8 rounded-lg shadow-xl w-full max-w-md relative">
                
                {/* Close Button */}
                <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
                >
                ✕
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

                <Form method="post" action="/register" className="mx-4 lg:mx-auto"> 

                    {/* Hidden route for the redirect */}
                    <input type="hidden" name="redirectTo" value={redirectLink} />

                <div className="flex flex-col gap-2 lg:gap-4">
                    {actionData?.error && (
                    <p className="text-red-500 text-sm text-center">{actionData.error}</p>
                    )}
                    
                    <input type="email" name="email" placeholder="Email" required className='input-field'/>

                    <input type="password" name="password" placeholder="Password" required className='input-field'/>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`auth-button ${isSubmitting ? 'opacity-50' : ''}`}
                    >
                    {isSubmitting && <ButtonSpinner />}
                    {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </div>

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
                </Form>
            </div>
        </div>
    </>
  )
}

export default RegistrationModal;