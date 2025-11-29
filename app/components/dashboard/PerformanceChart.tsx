import React from 'react'

interface PerformanceChartProps {
  className?: string
}

export const PerformanceChart = ({ className }: PerformanceChartProps) => {
  return (
    <article className={`flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm ${className ?? ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Performance</h2>
          <div className="mt-1 flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              Page Views
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
              Clicks
            </span>
          </div>
        </div>
        <select className="rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="this-week">This Week</option>
          <option value="last-week">Last Week</option>
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
        </select>
      </div>

      {/* Chart placeholder – replace with Recharts/Chart.js later */}
      <div className="flex h-64 w-full items-end justify-around gap-2 rounded-xl bg-muted/40 p-4">
        {[35, 50, 65, 55, 70, 90, 80, 60, 45, 55, 40, 50].map((height, idx) => (
          <div key={idx} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t-md bg-primary transition-[height]"
              style={{ height: `${height}%` }}
            />
            <span className="text-[10px] text-foreground/60">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx]}
            </span>
          </div>
        ))}
      </div>
    </article>
  )
}

export default PerformanceChart
