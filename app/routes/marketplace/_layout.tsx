import {data} from "react-router"
import type { Route } from "../marketplace/+types/_layout";
import { Outlet } from "react-router";
import { MarketPlaceNavbar, type Category } from "~/components/marketplace/MarketPlaceNavBar";
import { getOptionalAuth } from '~/utils/optionalAuth.server';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { Footer } from '~/components/Footer';

export interface University {
  id: string;
  name: string;
  short_code: string | null;
}

export async function loader({ request }: Route.LoaderArgs) {
  const { user: authUser, headers } = await getOptionalAuth(request);
  const { supabase } = createSupabaseServerClient(request);

  let userData = null; // Default to null for reliability

  if (authUser) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('username, avatar_url')
      .eq('id', authUser.id)
      .single();

    let avatar_url = "/images/default-avatar.png";
    
    // Only try to sign the URL if a profile and path exist
    if (profile?.avatar_url) {
      const { data: avatarData } = await supabase.storage
        .from('avatars')
        .createSignedUrl(profile.avatar_url, 3600);
      
      if (avatarData?.signedUrl) {
        avatar_url = avatarData.signedUrl;
      }
    }

    userData = {
      id: authUser.id,
      username: profile?.username || "Guest",
      avatar_url
    };
  }

  const [categoriesResult, universitiesResult] = await Promise.all([
    supabase.from('categories').select('id, name, slug, emoji').order('name'),
    supabase.from('universities').select('id, name, short_code').order('name'),
  ]);

  return data(
    { 
    user: userData, // This is now reliably null or a user object
    categories: categoriesResult.data ?? [], 
    universities: universitiesResult.data ?? [],
    headers 
    },
    {
      headers
    }
  );
}

export default function MarketplaceLayout({loaderData}: Route.ComponentProps) {

  const {user, categories, universities} = loaderData;
  
  return (
    <div className="min-h-screen bg-background">
      <MarketPlaceNavbar user={user} categories={categories} />
      <Outlet context={{ categories, universities }} />
      <footer id="footer" className='relative py-6 bg-footer-background text-footer-foreground'>
        {/* Footer content */}
        <Footer />
      </footer>
    </div>
  );
}


