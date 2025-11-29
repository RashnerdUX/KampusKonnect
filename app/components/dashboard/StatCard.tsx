import React from 'react'
import { FaArrowUp, FaArrowDown, FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router'

export interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trendPercent?: number
  trendDirection?: 'up' | 'down'
  comparisonPeriod?: string
  viewMoreLink?: string
}

export const StatCard = ({
  title,
  value,
  icon,
  trendPercent,
  trendDirection,
  comparisonPeriod,
  viewMoreLink,
}: StatCardProps) => {
  const trendColor = trendDirection === 'up' ? 'text-green-600' : 'text-red-500'
  const TrendIcon = trendDirection === 'up' ? FaArrowUp : FaArrowDown

  return (
    <article className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-foreground/70">{title}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </span>
      </div>

      <p className="text-3xl font-bold text-foreground">{value}</p>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {trendPercent !== undefined && trendDirection && (
          <span className={`flex items-center gap-1 font-medium ${trendColor}`}>
            <TrendIcon className="h-3 w-3" aria-hidden="true" />
            {trendPercent}%{' '}
            {comparisonPeriod && <span className="text-foreground/60">{comparisonPeriod}</span>}
          </span>
        )}
        {viewMoreLink && (
          <Link
            to={viewMoreLink}
            className="flex items-center gap-1 font-medium text-foreground/70 transition hover:text-foreground"
          >
            View more <FaArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  )
}

export default StatCard
