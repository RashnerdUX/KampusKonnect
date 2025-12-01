import React, { useState } from 'react'
import type { Route } from './+types/products'
import { FaPlus, FaFilter, FaSort, FaSearch, FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from 'react-icons/fa'
import { useNavigate, redirect, useSearchParams } from 'react-router'
import { createSupabaseServerClient } from '~/utils/supabase.server'

import ProductRow from '~/components/dashboard/ProductRow'

export const meta = () => {
  return [
    { title: 'Products - Campex' },
    { name: 'description', content: 'Products page for Campex' },
    { name: 'keywords', content: 'Campex, Products, Vendor' },
  ]
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, headers } = createSupabaseServerClient(request)
  const url = new URL(request.url)

  // Get pagination params from URL
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10))
  const perPage = Math.min(50, Math.max(10, parseInt(url.searchParams.get('perPage') ?? '10', 10)))
  const search = url.searchParams.get('search') ?? ''

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login', { headers })
  }

  // Get the store associated with this user
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (storeError || !store) {
    console.error('Error fetching store:', storeError)
    return redirect('/onboarding/vendor/store', { headers })
  }

  // Build the query
  let query = supabase
    .from('store_listings')
    .select(`
      id,
      title,
      description,
      price,
      image_url,
      is_active,
      created_at,
      category:categories(id, name),
      stock_quantity
    `, { count: 'exact' })
    .eq('store_id', store.id)

  // Apply search filter if provided
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  // Calculate offset
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  // Fetch paginated products
  const { data: products, error: productsError, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (productsError) {
    console.error('Error fetching products:', productsError)
    return {
      products: [],
      store,
      pagination: { page, perPage, totalItems: 0, totalPages: 0 },
      search,
    }
  }

  const totalItems = count ?? 0
  const totalPages = Math.ceil(totalItems / perPage)

  return {
    products: products ?? [],
    store,
    pagination: { page, perPage, totalItems, totalPages },
    search,
  }
}

export const Products = ({ loaderData }: Route.ComponentProps) => {
  const { products, pagination, search } = loaderData ?? {
    products: [],
    pagination: { page: 1, perPage: 10, totalItems: 0, totalPages: 0 },
    search: '',
  }

  const { page, perPage, totalPages, totalItems } = pagination

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const updateParams = (updates: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, String(value))
      } else {
        newParams.delete(key)
      }
    })
    setSearchParams(newParams)
  }

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage })
  }

  const handlePerPageChange = (newPerPage: number) => {
    updateParams({ perPage: newPerPage, page: 1 })
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchValue = formData.get('search') as string
    updateParams({ search: searchValue, page: 1 })
  }

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
      setSelectedIds(new Set(products.map((p) => p.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const allSelected = products.length > 0 && selectedIds.size === products.length

  return (
    <div className="flex flex-col gap-4">
      {/* Top controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        {/* Search */}
        <form onSubmit={handleSearch} className="w-full sm:w-auto">
          <label className="flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-primary">
            <FaSearch className="text-foreground/50" aria-hidden="true" />
            <input
              type="search"
              name="search"
              placeholder="Search..."
              defaultValue={search}
              className="w-full bg-transparent font-medium text-foreground placeholder:text-foreground/40 focus:outline-none sm:w-40 lg:w-56"
            />
          </label>
        </form>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted sm:gap-2 sm:px-4 sm:text-sm"
          >
            <FaSort className="h-3 w-3 sm:h-4 sm:w-4" /> 
            <span className="hidden xs:inline">Sort</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted sm:gap-2 sm:px-4 sm:text-sm"
          >
            <FaFilter className="h-3 w-3 sm:h-4 sm:w-4" /> 
            <span className="hidden xs:inline">Filter</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 cursor-pointer sm:gap-2 sm:px-4 sm:text-sm"
            onClick={() => navigate('/vendor/products/add')}
          >
            <FaPlus className="h-3 w-3 sm:h-4 sm:w-4" /> 
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* Results summary */}
      <p className="text-sm text-foreground/60">
        Showing {products.length} of {totalItems} products
      </p>

      {/* Mobile Cards View */}
      <div className="flex flex-col gap-3 md:hidden">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-foreground/60">
            No products found. Add your first product to get started.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-sm"
            >
              {/* Product Image */}
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-foreground/50">
                    N/A
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col gap-1">
                <h3 className="font-medium text-foreground line-clamp-1">{product.title}</h3>
                <p className="text-xs text-foreground/60">{product.category?.name ?? 'Uncategorized'}</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.is_active
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${product.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                    {product.is_active ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <span className="text-xs text-foreground/60">Qty: {product.stock_quantity ?? 0}</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-col items-end justify-between">
                <span className="font-bold text-foreground">₦{(product.price ?? 0).toLocaleString()}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => navigate(`/vendor/products/${product.id}/edit`)}
                    className="rounded-lg p-2 text-foreground/60 transition hover:bg-muted hover:text-foreground"
                  >
                    <FaEdit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => console.log('delete', product.id)}
                    className="rounded-lg p-2 text-foreground/60 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card shadow-sm md:block">
        <table className="w-full text-left text-sm">
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
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-foreground/60">
                  No products found. Add your first product to get started.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <ProductRow
                  key={product.id}
                  id={product.id}
                  name={product.title}
                  imageUrl={product.image_url ?? null}
                  category={product.category?.name ?? 'Uncategorized'}
                  status={product.is_active ? 'in-stock' : 'out-of-stock'}
                  stock={product.stock_quantity ?? 0}
                  price={product.price ?? 0}
                  selected={selectedIds.has(product.id)}
                  onSelect={toggleSelect}
                  onDelete={(id) => console.log('delete', id)}
                  onEdit={(id) => navigate(`/vendor/products/${id}/edit`)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex flex-col gap-3 text-sm text-foreground/70 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          {/* Items per page */}
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className="rounded border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>per page</span>
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-1">
            {/* Previous button */}
            <button
              type="button"
              className="rounded border border-border p-1.5 transition hover:bg-muted disabled:opacity-50"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <FaChevronLeft className="h-3 w-3" />
            </button>

            {/* Dynamic page buttons */}
            {(() => {
              const pages: (number | 'ellipsis')[] = []
              if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) pages.push(i)
              } else {
                pages.push(1)
                if (page > 3) pages.push('ellipsis')
                for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                  pages.push(i)
                }
                if (page < totalPages - 2) pages.push('ellipsis')
                pages.push(totalPages)
              }
              return pages.map((p, idx) =>
                p === 'ellipsis' ? (
                  <span key={`ellipsis-${idx}`} className="px-1">…</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    className={`rounded px-2.5 py-1 text-xs font-medium transition duration-200 sm:px-3 sm:text-sm ${
                      page === p
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border hover:bg-muted'
                    }`}
                  >
                    {p}
                  </button>
                )
              )
            })()}

            {/* Next button */}
            <button
              type="button"
              className="rounded border border-border p-1.5 transition hover:bg-muted disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              <FaChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products;