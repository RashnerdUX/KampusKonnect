import React from 'react'

interface ChartDataPoint {
  date: string
  revenue: number
  orders: number
}

interface PerformanceChartProps {
  className?: string
  data?: ChartDataPoint[]
}

const PerformanceChart = ({ className, data = [] }: PerformanceChartProps) => {
  // Find max revenue for scaling
  const maxRevenue = Math.max(...data.map((d) => Math.abs(d.revenue)), 1)

  return (
    <div className={`rounded-2xl border border-border bg-card p-4 ${className ?? ''}`}>
      <h3 className="mb-4 text-lg font-semibold text-foreground">Revenue Performance</h3>

      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-foreground/50">
          No data available yet
        </div>
      ) : (
        <div className="flex h-64 items-end gap-1">
          {data.map((point, index) => (
            <div
              key={`${point.date}-${index}`}
              className="group relative flex-1"
              title={`${point.date}: ₦${point.revenue.toLocaleString()}`}
            >
              {/* Bar */}
              <div
                className="w-full rounded-t bg-primary transition-all hover:bg-primary/80"
                style={{
                  height: `${(point.revenue / maxRevenue) * 100}%`,
                  minHeight: point.revenue > 0 ? '4px' : '0',
                }}
              />
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded bg-foreground px-2 py-1 text-xs text-background group-hover:block">
                ₦{point.revenue.toLocaleString()}
                <br />
                {point.orders} orders
              </div>
            </div>
          ))}
        </div>
      )}

      {/* X-axis labels (show first, middle, last) */}
      {data.length > 0 && (
        <div className="mt-2 flex justify-between text-xs text-foreground/60">
          <span>{data[0]?.date}</span>
          <span>{data[Math.floor(data.length / 2)]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      )}
    </div>
  )
}

export default PerformanceChart
