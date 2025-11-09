import { createSupabaseClient } from './supabase.client';

export const handleGoogleLogin = async () => {
    
    try{
        console.log("Google login initiated");

        const supabase = createSupabaseClient();

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (error) {
            console.error("Error during Google login:", error);
        }
        return true;
    } catch (error) {
            console.error("Unexpected error during Google login:", error);
            return false;
        }
}

export const handleFacebookLogin = async () => {
    // TODO: Handle this later
    console.log("Facebook login initiated");
}