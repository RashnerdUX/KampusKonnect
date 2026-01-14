import React, { useState } from 'react'
import type { Route } from './+types/vendor.$id';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { data, useSearchParams } from 'react-router';
import { Star, Search, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '~/components/marketplace/ProductCard';

const PRODUCTS_PER_PAGE = 12;

interface StoreCategory {
  id: string;
  name: string;
  count: number;
}

export const meta = ({ loaderData }: Route.MetaArgs) => {
  const store = loaderData.store;

  const universityName = store.university_name || 'Nigerian University';

  return [
    { title: `${store.business_name} - Shop at ${universityName}` },
    { name: 'description', content: `Check out ${store.business_name} on Campex. Serving the ${universityName} community` },

    // Social Media OG Tags
    // For Facebook, LinkedIn, WhatsApp
    { property: 'og:title', content: `${store.business_name} - Campex Vendor Store` },
    { property: 'og:description', content: `${store.description}. Available on Campex` || `Shop quality products from ${store.business_name} at ${universityName} on Campex.` || "Your go-to campus marketplace."},
    { property: 'og:image', content: store.logo_url || "https://slijaoqgxaewlqthtahj.supabase.co/storage/v1/object/public/assets/logo-green.png"},
    { property: 'og:type', content: 'profile'},

    // For twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: store.business_name },
    { name: "twitter:description", content: store.description || `Shop quality products from ${store.business_name} at ${universityName} on Campex.` || "Your go-to campus marketplace."},
    { name: "twitter:image", content: store.logo_url || "https://slijaoqgxaewlqthtahj.supabase.co/storage/v1/object/public/assets/logo-green.png"},
  ]
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { supabase, headers } = createSupabaseServerClient(request);
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get('q') || '';
  const categoryFilter = url.searchParams.get('category') || 'all';
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  const storeId = params.vendorId;

  // Fetch store details with category and user profile (for university)
  const { data: store, error: storeError } = await supabase
    .from('store_with_details')
    .select('*')
    .eq('store_id', storeId)
    .maybeSingle();

  if (storeError || !store) {
    throw new Response("Store not found", { status: 404 });
  }

  // Build product query
  let productsQuery = supabase
    .from('store_listings')
    .select(`
      *,
      categories(id, name, slug)
    `, { count: 'exact' })
    .eq('store_id', storeId)
    .eq('is_active', true);

  // Apply search filter
  if (searchQuery) {
    productsQuery = productsQuery.textSearch('search_vector', searchQuery, {
      type: 'websearch',
      config: 'english'
    });
  }

  // Apply category filter
  if (categoryFilter && categoryFilter !== 'all') {
    productsQuery = productsQuery.eq('category_id', categoryFilter);
  }

  // Apply pagination
  const from = (page - 1) * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;

  const { data: products, count: filteredCount, error: productsError } = await productsQuery
    .order('created_at', { ascending: false })
    .range(from, to);

  if (productsError) {
    console.error('Error fetching products:', productsError);
  }

  const totalPages = Math.ceil((filteredCount || 0) / PRODUCTS_PER_PAGE);

  // Get category counts for sidebar
  const { data: allProducts } = await supabase
    .from('store_listings')
    .select('category_id, categories(id, name)')
    .eq('store_id', storeId)
    .eq('is_active', true);

  // Calculate category counts
  const categoryCounts: Record<string, { name: string; count: number }> = {};
  let totalProducts = 0;
  
  if (allProducts) {
    totalProducts = allProducts.length;
    allProducts.forEach((product: any) => {
      if (product.category_id && product.categories) {
        if (!categoryCounts[product.category_id]) {
          categoryCounts[product.category_id] = { name: product.categories.name, count: 0 };
        }
        categoryCounts[product.category_id].count++;
      }
    });
  }

  const storeCategories: StoreCategory[] = Object.entries(categoryCounts).map(([id, data]) => ({
    id,
    name: data.name,
    count: data.count
  }));

  return data({
    store,
    products: products ?? [],
    storeCategories,
    totalProducts,
    filteredCount: filteredCount ?? 0,
    currentPage: page,
    totalPages,
    searchQuery,
    categoryFilter
  }, { headers });
};

export const VendorStore = ({ loaderData }: Route.ComponentProps) => {
  const { store, products, storeCategories, totalProducts, filteredCount, currentPage, totalPages, searchQuery, categoryFilter } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localSearch) {
      params.set('q', localSearch);
    } else {
      params.delete('q');
    }
    params.delete('page'); // Reset to page 1
    setSearchParams(params);
  };

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    params.delete('page'); // Reset to page 1
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  // Extract university info
  const universityName = store.university_short_code || 'Unknown';

  // Calculate rating stars
  const rating = store.rating ?? 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
        <img
          src={store.header_url || '/images/vendor-banner-placeholder.jpg'}
          alt={`${store.business_name} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Store Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-card rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-4 border-background shadow-md bg-muted">
                <img
                  src={store.logo_url || '/images/store-placeholder.png'}
                  alt={store.business_name || "Unknown"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Store Details */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {store.business_name}
                </h1>
                {store.verified_badge && (
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm font-medium px-2.5 py-0.5 rounded-full">
                    <CheckCircle size={14} />
                    Verified
                  </span>
                )}
              </div>
              
              <p className="text-muted-foreground mb-4">
                {store.description || store.store_category || 'Campus Vendor'}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < fullStars
                            ? 'text-yellow-400 fill-yellow-400'
                            : i === fullStars && hasHalfStar
                            ? 'text-yellow-400 fill-yellow-400/50'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {store.total_reviews ?? 0} reviews
                  </span>
                </div>

                {/* Products Count */}
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">{totalProducts}</div>
                  <div className="text-xs text-muted-foreground">Products</div>
                </div>

                {/* University */}
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">{universityName}</div>
                  <div className="text-xs text-muted-foreground">University</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>

            {/* Categories */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-4">Categories</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      categoryFilter === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>All</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      categoryFilter === 'all'
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {totalProducts}
                    </span>
                  </button>
                </li>
                {storeCategories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        categoryFilter === cat.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        categoryFilter === cat.id
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {categoryFilter === 'all' ? 'All Products' : 'Featured'}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredCount} product{filteredCount !== 1 ? 's' : ''}
              </span>
            </div>

            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 xl:gap-6">
                  {products.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.title}
                      storeName={store.business_name || "Unknown"}
                      price={product.price}
                      imageUrl={product.image_url}
                      rating={store.rating ?? undefined}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors text-sm"
                    >
                      <ChevronLeft size={16} />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {/* First page */}
                      {currentPage > 3 && (
                        <>
                          <button
                            onClick={() => handlePageChange(1)}
                            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-muted transition-colors text-sm"
                          >
                            1
                          </button>
                          {currentPage > 4 && <span className="px-1 text-muted-foreground">...</span>}
                        </>
                      )}

                      {/* Page numbers around current */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                        .map(page => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 border rounded-lg transition-colors text-sm ${
                              page === currentPage
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'border-border bg-background text-foreground hover:bg-muted'
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                      {/* Last page */}
                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && <span className="px-1 text-muted-foreground">...</span>}
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-muted transition-colors text-sm"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors text-sm"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <div className="text-muted-foreground mb-2">No products found</div>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default VendorStore;
