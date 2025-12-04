import React from 'react';
import type { Route } from "../marketplace/+types/_layout";
import { Outlet } from "react-router";
import { MarketPlaceNavbar } from "~/components/marketplace/MarketPlaceNavBar";
import { getOptionalAuth } from '~/utils/optionalAuth.server';
import { Footer } from '~/components/Footer';

export async function loader({ request }: Route.LoaderArgs) {
  const {user, headers} = await getOptionalAuth(request);
  
  return { user, headers: headers };
}

export default function MarketplaceLayout({loaderData}: Route.ComponentProps) {

  const {user} = loaderData;
  
  return (
    <div className="min-h-screen bg-background">
      <MarketPlaceNavbar user={user} />
      <Outlet />
      <footer id="footer" className='relative py-6 bg-footer-background text-footer-foreground'>
        {/* Footer content */}
        <Footer />
      </footer>
    </div>
  );
}


