import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router'

export interface TopProduct {
  id: string
  name: string
  imageUrl?: string
  sales: number
}

interface BestPerformingProductsProps {
  products: TopProduct[]
  viewMoreLink?: string
  className?: string
}

export const BestPerformingProducts = ({
  products,
  viewMoreLink,
  className,
}: BestPerformingProductsProps) => {
  return (
    <article className={`flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm ${className ?? ''}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Best Performing Products</h2>
        {viewMoreLink && (
          <Link
            to={viewMoreLink}
            className="flex items-center gap-1 text-sm font-medium text-foreground/70 transition hover:text-foreground"
          >
            <FaArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {products.slice(0, 5).map((product, idx) => (
          <li key={product.id} className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {idx + 1}
            </span>
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs text-foreground/50">N/A</span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
            </div>
            <span className="text-sm font-semibold text-foreground">{product.sales.toLocaleString()} sold</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default BestPerformingProducts
