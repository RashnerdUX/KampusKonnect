import React, { useState } from 'react'
import { FaPlus, FaFilter, FaSort, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import ProductRow, { type ProductRowProps, type ProductStatus } from '~/components/dashboard/ProductRow'

export const meta = () => {
  return [
    { title: 'Products - Campex' },
    { name: 'description', content: 'Products page for Campex' },
    { name: 'keywords', content: 'Campex, Products, Vendor' },
  ]
}

// Sample data – replace with loader data
const sampleProducts: Omit<ProductRowProps, 'onDelete' | 'onEdit' | 'selected' | 'onSelect'>[] = [
  { id: '1', name: 'Mens T-shirt', imageUrl: '', category: 'Clothes', status: 'out-of-stock', stock: 449, price: 172 },
  { id: '2', name: 'Leather Hand Bag', imageUrl: '', category: 'Bag', status: 'in-stock', stock: 223, price: 112 },
  { id: '3', name: 'Pure Leather Male Shoe', imageUrl: '', category: 'Shoe', status: 'coming-soon', stock: 98, price: 152 },
  { id: '4', name: 'Stylish Shoe', imageUrl: '', category: 'Shoe', status: 'out-of-stock', stock: 74, price: 195 },
  { id: '5', name: 'Nike Airforce X7', imageUrl: '', category: 'Shoe', status: 'in-stock', stock: 243, price: 170 },
  { id: '6', name: 'Man Watch', imageUrl: '', category: 'Watch', status: 'coming-soon', stock: 87, price: 142 },
  { id: '7', name: 'Casual Sunglass', imageUrl: '', category: 'Sunglass', status: 'out-of-stock', stock: 12, price: 170 },
]

export const loader = async () => {
  return null
}

export const Products = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(sampleProducts.map((p) => p.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const allSelected = sampleProducts.length > 0 && selectedIds.size === sampleProducts.length

  return (
    <div className="flex flex-col gap-4">
      {/* Top controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <label className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-primary">
          <FaSearch className="text-foreground/50" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search..."
            className="w-40 bg-transparent font-medium text-foreground placeholder:text-foreground/40 focus:outline-none sm:w-56"
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            <FaSort className="h-4 w-4" /> Sort
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            <FaFilter className="h-4 w-4" /> Filter
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <FaPlus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-foreground/60">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
              </th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {sampleProducts.map((product) => (
              <ProductRow
                key={product.id}
                {...product}
                selected={selectedIds.has(product.id)}
                onSelect={toggleSelect}
                onDelete={(id) => console.log('delete', id)}
                onEdit={(id) => console.log('edit', id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-foreground/70">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="rounded border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>per page</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded border border-border p-1.5 transition hover:bg-muted disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            <FaChevronLeft className="h-3 w-3" />
            <FaChevronLeft className="h-3 w-3 -ml-1.5" />
          </button>
          <button
            type="button"
            className="rounded border border-border p-1.5 transition hover:bg-muted disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <FaChevronLeft className="h-3 w-3" />
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`rounded px-3 py-1 font-medium transition ${
                currentPage === page ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'
              }`}
            >
              {page}
            </button>
          ))}
          <span className="px-1">…</span>
          {[4, 5, 6].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`rounded px-3 py-1 font-medium transition ${
                currentPage === page ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="rounded border border-border p-1.5 transition hover:bg-muted"
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <FaChevronRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            className="rounded border border-border p-1.5 transition hover:bg-muted"
            onClick={() => setCurrentPage(6)}
          >
            <FaChevronRight className="h-3 w-3" />
            <FaChevronRight className="h-3 w-3 -ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Products