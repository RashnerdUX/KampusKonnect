import React, { useState } from 'react';
import type { Route } from '../vendors/+types/index';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { data, useSearchParams, Link } from 'react-router';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { VendorCard } from '~/components/marketplace/VendorCard';

const VENDORS_PER_PAGE = 16;

interface StoreCategory {
  id: string;
  name: string;
}

interface University {
  id: string;
  name: string;
  short_code: string | null;
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, headers } = createSupabaseServerClient(request);
  const url = new URL(request.url);
  
  // Get filter params
  const searchQuery = url.searchParams.get('q') || '';
  const categoryFilter = url.searchParams.get('category') || '';
  const universityFilter = url.searchParams.get('university') || '';
  const sortBy = url.searchParams.get('sort') || 'newest';
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  // Fetch filter options in parallel
  const [categoriesResult, universitiesResult] = await Promise.all([
    supabase.from('store_categories').select('id, name').order('name'),
    supabase.from('universities').select('id, name, short_code').order('name')
  ]);

  // Build vendors query with joins
  let vendorsQuery = supabase
    .from('stores')
    .select(`
      *,
      store_categories(id, name),
      user_profiles!inner(university_id, universities(id, name, short_code))
    `, { count: 'exact' });

  // Apply search filter
  if (searchQuery) {
    vendorsQuery = vendorsQuery.ilike('business_name', `%${searchQuery}%`);
  }

  // Apply category filter
  if (categoryFilter) {
    vendorsQuery = vendorsQuery.eq('category_id', categoryFilter);
  }

  // Apply university filter
  if (universityFilter) {
    vendorsQuery = vendorsQuery.eq('user_profiles.university_id', universityFilter);
  }

  // Apply sorting
  switch (sortBy) {
    case 'name-asc':
      vendorsQuery = vendorsQuery.order('business_name', { ascending: true });
      break;
    case 'name-desc':
      vendorsQuery = vendorsQuery.order('business_name', { ascending: false });
      break;
    case 'rating':
      vendorsQuery = vendorsQuery.order('rating', { ascending: false, nullsFirst: false });
      break;
    case 'oldest':
      vendorsQuery = vendorsQuery.order('created_at', { ascending: true });
      break;
    case 'newest':
    default:
      vendorsQuery = vendorsQuery.order('created_at', { ascending: false });
      break;
  }

  // Apply pagination
  const from = (page - 1) * VENDORS_PER_PAGE;
  const to = from + VENDORS_PER_PAGE - 1;
  vendorsQuery = vendorsQuery.range(from, to);

  const { data: vendors, count, error } = await vendorsQuery;

  if (error) {
    console.error('Error fetching vendors:', error);
  }

  const totalPages = Math.ceil((count || 0) / VENDORS_PER_PAGE);

  return data({
    vendors: vendors ?? [],
    storeCategories: categoriesResult.data as StoreCategory[] ?? [],
    universities: universitiesResult.data as University[] ?? [],
    totalCount: count ?? 0,
    currentPage: page,
    totalPages,
    searchQuery,
    categoryFilter,
    universityFilter,
    sortBy
  }, { headers });
};

export const VendorsIndex = ({ loaderData }: Route.ComponentProps) => {
  const {
    vendors,
    storeCategories,
    universities,
    totalCount,
    currentPage,
    totalPages,
    searchQuery,
    categoryFilter,
    universityFilter,
    sortBy
  } = loaderData;

  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);

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

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset to page 1
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const clearFilters = () => {
    setLocalSearch('');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || categoryFilter || universityFilter;

  // Get selected filter names for display
  const selectedCategory = storeCategories.find(c => c.id === categoryFilter);
  const selectedUniversity = universities.find(u => u.id === universityFilter);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-footer-background text-footer-foreground py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Browse Vendors
          </h1>
          <p className="text-center text-footer-foreground/80 max-w-2xl mx-auto">
            Discover trusted campus vendors offering quality products and services
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-card rounded-xl border border-border p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search vendors..."
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg bg-background text-foreground"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>

          {/* Filter Dropdowns */}
          <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-4 mt-4`}>
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="flex-1 px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {storeCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* University Filter */}
            <select
              value={universityFilter}
              onChange={(e) => handleFilterChange('university', e.target.value)}
              className="flex-1 px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Universities</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.short_code || uni.name}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
                Clear filters
              </button>
            )}
          </div>

          {/* Active Filters Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  Search: "{searchQuery}"
                  <button onClick={() => handleFilterChange('q', '')} className="hover:text-primary/70">
                    <X size={14} />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  {selectedCategory.name}
                  <button onClick={() => handleFilterChange('category', '')} className="hover:text-primary/70">
                    <X size={14} />
                  </button>
                </span>
              )}
              {selectedUniversity && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  {selectedUniversity.short_code || selectedUniversity.name}
                  <button onClick={() => handleFilterChange('university', '')} className="hover:text-primary/70">
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{vendors.length}</span> of{' '}
            <span className="font-medium text-foreground">{totalCount}</span> vendors
          </p>
        </div>

        {/* Vendors Grid */}
        {vendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {vendors.map((vendor: any) => (
              <VendorCard
                key={vendor.id}
                id={vendor.id}
                name={vendor.business_name}
                tagline={vendor.description || 'Campus Vendor'}
                university={vendor.user_profiles?.universities?.short_code || vendor.user_profiles?.universities?.name || 'Unknown'}
                logoUrl={vendor.logo_url ?? ''}
                rating={vendor.rating ?? 0}
                category={vendor.store_categories?.name || 'General'}
                verified={vendor.verified_badge ?? false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <div className="text-muted-foreground mb-2">No vendors found</div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-primary hover:underline text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-muted transition-colors"
                  >
                    1
                  </button>
                  {currentPage > 4 && <span className="px-2 text-muted-foreground">...</span>}
                </>
              )}

              {/* Page numbers around current */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                .map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 border rounded-lg transition-colors ${
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
                  {currentPage < totalPages - 3 && <span className="px-2 text-muted-foreground">...</span>}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-muted transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorsIndex;
