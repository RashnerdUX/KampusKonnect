import React from 'react'
import type { Route } from './+types/_layout';

import { Outlet } from 'react-router';
import SideNavigationBar from '~/components/dashboard/SideNavigationBar';
import DashboardTopBar from '~/components/dashboard/DashboardTopBar';
import { redirect } from "react-router";
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { requireAuth } from '~/utils/requireAuth';

export const meta = () => {
    return [
        { title: "Vendor Dashboard - Campex" },
        { name: "description", content: "Vendor Dashboard for Campex" },
        { name : "keywords", content: "Campex, Vendor, Dashboard" },
    ]
}

export const action = async ({request}: Route.ActionArgs) => {
    const {supabase, headers} = createSupabaseServerClient(request);
    const currentLocation = new URL(request.url);

    const formData = await request.formData();
    const action = formData.get("_action");

    if (action === "logout") {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Error signing out: ", error.message);
            return redirect(currentLocation.pathname, {headers: headers});
        }

        return redirect("/login", {headers: headers});
    }
}

export const loader =  async ({request}: Route.LoaderArgs) => {

    const { user, headers } = await requireAuth(request);

    return { user, headers };
}

export const VendorDashboardLayout = ({loaderData}: Route.ComponentProps) => {

  return (
    <div className="min-h-screen flex bg-muted">
      <SideNavigationBar />
      <div className="flex-1 flex flex-col px-4 py-6 gap-6">
        <DashboardTopBar user={loaderData.user} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default VendorDashboardLayout;