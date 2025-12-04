import React from 'react';
import type { Route } from "../marketplace/+types/_layout";
import { Outlet } from "react-router";
import { MarketPlaceNavbar, type Category } from "~/components/marketplace/MarketPlaceNavBar";
import { getOptionalAuth } from '~/utils/optionalAuth.server';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { Footer } from '~/components/Footer';

export async function loader({ request }: Route.LoaderArgs) {
  const {user, headers} = await getOptionalAuth(request);
  
  // Fetch categories for navigation
  const { supabase } = createSupabaseServerClient(request);
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, emoji')
    .order('name', { ascending: true });
  
  return { user, categories: categories as Category[] ?? [], headers: headers };
}

export default function MarketplaceLayout({loaderData}: Route.ComponentProps) {

  const {user, categories} = loaderData;
  
  return (
    <div className="min-h-screen bg-background">
      <MarketPlaceNavbar user={user} categories={categories} />
      <Outlet />
      <footer id="footer" className='relative py-6 bg-footer-background text-footer-foreground'>
        {/* Footer content */}
        <Footer />
      </footer>
    </div>
  );
}


