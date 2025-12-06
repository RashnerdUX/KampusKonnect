import React from 'react'
import { FaTrash, FaPen } from 'react-icons/fa'
import { Form, useNavigate } from 'react-router'

export type ProductStatus = 'in-stock' | 'out-of-stock' | 'coming-soon'

export interface ProductRowProps {
  id: string
  name: string
  imageUrl?: string | null
  category: string
  status: ProductStatus
  stock: number
  price: number
  selected?: boolean
  onSelect?: (id: string, checked: boolean) => void
}

const statusConfig: Record<ProductStatus, { label: string; color: string }> = {
  'in-stock': { label: 'In Stock', color: 'bg-green-500' },
  'out-of-stock': { label: 'Out of Stock', color: 'bg-red-500' },
  'coming-soon': { label: 'Coming Soon', color: 'bg-yellow-500' },
}

export const ProductRow = ({
  id,
  name,
  imageUrl,
  category,
  status,
  stock,
  price,
  selected,
  onSelect,
}: ProductRowProps) => {
  const { label, color } = statusConfig[status]

  const navigate = useNavigate()

  return (
    <tr className="border-b border-border transition hover:bg-muted/40">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected ?? false}
          onChange={(e) => onSelect?.(id, e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs text-foreground/50">N/A</span>
            )}
          </div>
          <span className="font-medium text-foreground">{name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-foreground/80">{category}</td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-opacity-10 px-2.5 py-1 text-xs font-medium">
          <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden="true" />
          {label}
        </span>
      </td>
      <td className="px-4 py-3 text-foreground/80">{stock}</td>
      <td className="px-4 py-3 font-medium text-foreground">₦{price.toFixed(2)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Form method="post">
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="productId" value={id} />
            <button
              type="submit"
              className="rounded-lg p-2 text-foreground/60 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
            >
            <FaTrash className="h-4 w-4" />
            </button>
          </Form>
          <button
            type="button"
            onClick={() => navigate(`/vendor/products/${id}/edit`)}
            className="rounded p-1.5 text-foreground/60 transition hover:bg-primary/10 hover:text-primary"
            aria-label="Edit product"
          >
            <FaPen className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ProductRow
