import React from 'react'
import { FaDollarSign, FaBoxOpen, FaShoppingCart, FaUsers } from 'react-icons/fa'

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

export const DashboardHome = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="₦6,659"
          icon={<FaDollarSign className="h-5 w-5" />}
          trendPercent={2.3}
          trendDirection="up"
          comparisonPeriod="Last Week"
          viewMoreLink="/vendor/revenue"
        />
        <StatCard
          title="Total Products"
          value="893"
          icon={<FaBoxOpen className="h-5 w-5" />}
          trendPercent={8.1}
          trendDirection="up"
          comparisonPeriod="Last Month"
          viewMoreLink="/vendor/products"
        />
        <StatCard
          title="Total Orders"
          value="9,856"
          icon={<FaShoppingCart className="h-5 w-5" />}
          trendPercent={2.3}
          trendDirection="up"
          comparisonPeriod="Last Week"
          viewMoreLink="/vendor/orders"
        />
        <StatCard
          title="Total Customers"
          value="4.6k"
          icon={<FaUsers className="h-5 w-5" />}
          trendPercent={10.6}
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
