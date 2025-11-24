import React from 'react';
import type { Route } from "../marketplace/+types/_layout";
import { Outlet } from "react-router";
import { MarketPlaceNavbar } from "~/components/marketplace/MarketPlaceNavBar";
import { getOptionalAuth } from '~/utils/optionalAuth';

export async function loader({ request }: Route.LoaderArgs) {
  const {session, user, headers} = await getOptionalAuth(request);
  
  return { user, headers: headers };
}

export default function MarketplaceLayout({loaderData}: Route.ComponentProps) {

  const {user, headers} = loaderData;
  
  return (
    <div className="min-h-screen bg-background">
      <MarketPlaceNavbar user={user} />
      <Outlet />
    </div>
  );
}


