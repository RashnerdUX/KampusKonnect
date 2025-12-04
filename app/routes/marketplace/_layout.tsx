import React from 'react';
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
  const {user, headers} = await getOptionalAuth(request);
  
  // Fetch categories and universities for navigation/search
  const { supabase } = createSupabaseServerClient(request);
  
  const [categoriesResult, universitiesResult] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, slug, emoji')
      .order('name', { ascending: true }),
    supabase
      .from('universities')
      .select('id, name, short_code')
      .order('name', { ascending: true })
  ]);
  
  return { 
    user, 
    categories: categoriesResult.data as Category[] ?? [], 
    universities: universitiesResult.data as University[] ?? [],
    headers: headers 
  };
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


