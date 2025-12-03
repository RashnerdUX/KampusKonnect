import React from 'react'
import type { Route } from './+types/index';
import { FaDollarSign, FaBoxOpen, FaShoppingCart, FaUsers } from 'react-icons/fa'
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { redirect, data } from 'react-router';

import StatCard from '~/components/dashboard/StatCard'
import PerformanceChart from '~/components/dashboard/PerformanceChart'
import BestPerformingProducts from '~/components/dashboard/BestPerformingProducts'

const sampleTopProducts = [
  { id: '1', name: 'Wireless Headphones', imageUrl: '', sales: 342 },
  { id: '2', name: 'Organic Green Tea', imageUrl: '', sales: 289 },
  { id: '3', name: 'Classic Novel Set', imageUrl: '', sales: 214 },
  { id: '4', name: 'Fitness Tracker', imageUrl: '', sales: 198 },
  { id: '5', name: 'Portable Charger', imageUrl: '', sales: 176 },
]

export const meta = () => {
  return [
    { title: 'Vendor Dashboard - Campex' },
    { name: 'description', content: 'Overview of your vendor performance and key metrics.' },
  ]
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  
  // Fetch the user
  const { supabase, headers } = await createSupabaseServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login', { headers });
  }

  // Get store associated with user
  const { data: storeData, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single();
  
  if (storeError) {
    console.error('Error fetching store data:', storeError);
    return redirect('/vendor', { headers });
  }
  // Get the number of products for this vendor
  const { count, error: countError } = await supabase
    .from('store_listings')
    .select('id', { count: 'exact', head: true })
    .eq('store_id', storeData.id);

  if (countError) {
    console.error('Error fetching product count:', countError);
    return redirect('/vendor', { headers });
  }

  console.log('Product count data:', count);

  // Get other stat data when available

  return data({productCount: count || 0 }, { headers });
}

export const DashboardHome = (
  { loaderData }: Route.ComponentProps
) => {

  const { productCount } = loaderData as { productCount: number };


  return (
    <div className="flex flex-col gap-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="₦0.00"
          icon={<FaDollarSign className="h-5 w-5" />}
          trendPercent={0.0}
          trendDirection="up"
          comparisonPeriod="Last Week"
          viewMoreLink="/vendor/revenue"
        />
        <StatCard
          title="Total Products"
          value={productCount}
          icon={<FaBoxOpen className="h-5 w-5" />}
          trendPercent={0.0}
          trendDirection="up"
          comparisonPeriod="Last Month"
          viewMoreLink="/vendor/products"
        />
        <StatCard
          title="Total Orders"
          value="0"
          icon={<FaShoppingCart className="h-5 w-5" />}
          trendPercent={0.0}
          trendDirection="up"
          comparisonPeriod="Last Week"
          viewMoreLink="/vendor/orders"
        />
        <StatCard
          title="Total Customers"
          value="0"
          icon={<FaUsers className="h-5 w-5" />}
          trendPercent={0.0}
          trendDirection="down"
          comparisonPeriod="Last Month"
          viewMoreLink="/vendor/customers"
        />
      </div>

      {/* Performance + Best Products row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PerformanceChart className="lg:col-span-2" />
        <BestPerformingProducts
          products={sampleTopProducts}
          viewMoreLink="/vendor/products"
        />
      </div>
    </div>
  )
}

export default DashboardHome
