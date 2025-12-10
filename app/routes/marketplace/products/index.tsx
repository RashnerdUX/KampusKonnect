import { useEffect, useMemo, useState } from "react";
import type { Route } from "../products/+types/index";
import { FaFilter, FaSort } from "react-icons/fa6";
import { useLocation, useNavigate, data } from "react-router";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ProductCard from "~/components/marketplace/ProductCard";
import FilterControls, {
  parseFiltersFromSearch,
  createDefaultFilters,
  FILTER_QUERY_KEYS,
  RATING_OPTIONS,
} from "~/components/marketplace/ProductFilter";
import type { Filters, FilterMultiKey, RatingFilterKey } from "~/components/marketplace/ProductFilter";

const SORT_QUERY_KEY = "sort";
const ITEMS_PER_PAGE = 15;

const SORT_OPTIONS = [
  { value: "relevance", label: "Sort by Relevance" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "popular", label: "Most Popular" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const DEFAULT_SORT: SortValue = "relevance";

const isSortValue = (value: string): value is SortValue =>
  SORT_OPTIONS.some((option) => option.value === value);

export const meta = ({ loaderData, location }: Route.MetaArgs) => {
  const { filters } = loaderData || {};
  
  // Build dynamic title based on active filters
  let title = "All Products";
  const parts: string[] = [];

  // If there's a search query, reflect that in the title
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("q")?.trim();
  
  if (filters?.universities?.length) {
    parts.push(filters.universities.join(", "));
  }
  if (filters?.categories?.length) {
    parts.push(filters.categories.join(", "));
  }
  
  if (parts.length > 0) {
    title = `${parts.join(" ")} Products`;
  }

  if (searchQuery) {
    title = parts.length > 0 
      ? `${parts.join(" ")} Products matching "${searchQuery}"`
      : `Search results for "${searchQuery}"`;
  }

  return [
    { title: `${title} | Campex Marketplace` },
    { name: "description", content: `Browse ${title.toLowerCase()} from campus vendors on Campex` },
    { name: "keywords", content: "campus, marketplace, products, vendors" }
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const { supabase, headers } = createSupabaseServerClient(request);

  const pageParam = Number(url.searchParams.get("page") ?? 1);
  const sortParam = url.searchParams.get(SORT_QUERY_KEY) ?? DEFAULT_SORT;
  const sort = isSortValue(sortParam) ? sortParam : DEFAULT_SORT;
  const filters = parseFiltersFromSearch(url.search);

  // Build query from the flattened view
  let query = supabase
    .from('product_listing_view')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  // Apply search filter
  const searchQuery = url.searchParams.get("q")?.trim();
  if (searchQuery) {
    query = query.textSearch('search_vector', searchQuery, {
      type: 'websearch',
      config: 'english'
    });
  }

  // ✅ Now you can filter directly on flattened columns!
  if (filters.universities.length > 0) {
    query = query.in('university_name', filters.universities);
  }

  if (filters.categories.length > 0) {
    query = query.in('category_name', filters.categories);
  }

  // Apply price filters
  if (filters.priceMin) {
    const minPrice = parseFloat(filters.priceMin);
    if (!isNaN(minPrice)) {
      query = query.gte('price', minPrice);
    }
  }
  if (filters.priceMax) {
    const maxPrice = parseFloat(filters.priceMax);
    if (!isNaN(maxPrice)) {
      query = query.lte('price', maxPrice);
    }
  }

  // Apply sorting
  switch (sort) {
    case "price-low-high":
      query = query.order('price', { ascending: true });
      break;
    case "price-high-low":
      query = query.order('price', { ascending: false });
      break;
    case "newest":
      query = query.order('created_at', { ascending: false });
      break;
    case "popular":
      query = query.order('created_at', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  // Pagination
  const requestedPage = Math.max(1, Number.isNaN(pageParam) ? 1 : pageParam);
  const from = (requestedPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data: products, count: totalItems, error: productsError } = await query.range(from, to);

  if (productsError) {
    console.error('Error fetching products:', productsError);
  }

  const total = totalItems ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);

  // Fetch filter options
  const [{ data: universities }, { data: categories }] = await Promise.all([
    supabase.from('universities').select('id, name').order('name'),
    supabase.from('categories').select('id, name').order('name'),
  ]);

  return data({
    products: products ?? [],
    pagination: {
      currentPage,
      totalPages,
      totalItems: total,
      pageSize: ITEMS_PER_PAGE,
    },
    filters,
    sort,
    filterOptions: {
      universities: universities?.map(u => u.name) ?? [],
      categories: categories?.map(c => c.name) ?? [],
    },
  }, { headers });
}

export const IndexPage = ({ loaderData }: Route.ComponentProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { products, pagination, filters: serverFilters, sort, filterOptions } = loaderData;
  const { currentPage, totalPages, totalItems } = pagination;
  const [filters, setFilters] = useState<Filters>(() => serverFilters ?? createDefaultFilters());
  const [selectedSort, setSelectedSort] = useState<SortValue>(sort ?? DEFAULT_SORT);

  // Check if the user used a specific query to access this page. Whether it is a category or a name search.
  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("q")?.trim() ?? "";
  }, [location.search]);

  const isSearchQuery = searchQuery.length > 0;

  useEffect(() => {
    setFilters(serverFilters ?? createDefaultFilters());
  }, [serverFilters]);

  useEffect(() => {
    if (sort && isSortValue(sort)) {
      setSelectedSort(sort);
    } else {
      setSelectedSort(DEFAULT_SORT);
    }
  }, [sort]);

  const convertToNormalCase = (str: string) => {
    if (!str) return '';
    const firstChar = str.charAt(0).toUpperCase();
    const rest = str.slice(1).toLowerCase();
    return firstChar + rest;
  }

  const visiblePageNumbers = (() => {
    const delta = 1; // Show only 1 page on each side of current
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);

    // Ensure we show at least 3 pages when possible
    if (end - start < 2 && totalPages >= 3) {
      if (start === 1) {
        end = Math.min(3, totalPages);
      } else if (end === totalPages) {
        start = Math.max(1, totalPages - 2);
      }
    }

    const pages: number[] = [];
    for (let page = start; page <= end; page++) {
      pages.push(page);
    }
    return pages;
  })();

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams(location.search);
    params.set("page", String(page));
    return `${location.pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    navigate(buildPageHref(page));
  };

  const applySortToSearchParams = (value: SortValue) => {
    const params = new URLSearchParams(location.search);
    params.set(SORT_QUERY_KEY, value);
    params.delete("page");
    return params;
  };

  const applyFiltersToSearchParams = (nextFilters: Filters) => {
    const params = new URLSearchParams(location.search);
    params.delete("page");

    FILTER_QUERY_KEYS.forEach((key) => {
      params.delete(key);
    });

    if (nextFilters.priceMin) params.set("priceMin", nextFilters.priceMin);
    if (nextFilters.priceMax) params.set("priceMax", nextFilters.priceMax);
    nextFilters.universities.forEach((value) => params.append("university", value));
    nextFilters.categories.forEach((value) => params.append("category", value));
    if (nextFilters.productRating) params.set("productRating", nextFilters.productRating);

    return params;
  };

  const updateFilters = (updater: (prev: Filters) => Filters) => {
    setFilters((prev) => {
      const next = updater(prev);
      const params = applyFiltersToSearchParams(next);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
      return next;
    });
  };

  const handlePriceChange = (field: "priceMin" | "priceMax", value: string) => {
    updateFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleMulti = (field: FilterMultiKey, value: string) => {
    updateFilters((prev) => {
      const exists = prev[field].includes(value);
      const nextValues = exists ? prev[field].filter((item) => item !== value) : [...prev[field], value];
      return { ...prev, [field]: nextValues };
    });
  };

  const handleRatingChange = (field: RatingFilterKey, value: string) => {
    updateFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    const defaultFilters = createDefaultFilters();
    setFilters(defaultFilters);
    const params = new URLSearchParams(location.search);
    FILTER_QUERY_KEYS.forEach((key) => params.delete(key));
    params.delete("page");
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleSortChange = (value: SortValue) => {
    if (value === selectedSort) {
      setShowSortOptions(false);
      return;
    }

    setSelectedSort(value);
    const params = applySortToSearchParams(value);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    setShowSortOptions(false);
  };

  return (
    <section className="py-4 sm:py-4 md:py-6 lg:py-8 min-h-screen">
      <div className="mx-auto flex w-full md:max-w-8xl flex-col gap-6 px-2 sm:px-4 lg:px-8 md:flex-row">
        <aside className="hidden w-full shrink-0 space-y-6 rounded-2xl bg-card p-4 shadow-sm lg:sticky lg:top-24 md:block md:w-50 lg:w-72">
          <FilterControls
            filters={filters}
            options={{
              universities: filterOptions.universities,
              categories: filterOptions.categories,
              ratingOptions: RATING_OPTIONS,
            }}
            onPriceChange={handlePriceChange}
            onToggleMulti={handleToggleMulti}
            onRatingChange={handleRatingChange}
            onReset={handleResetFilters}
            groupId="desktop"
          />
        </aside>

        <main className="flex-1 py-2 px-1 md:p-4">

            <div className="relative">
                <div className="flex items-start justify-between">
                    <div className="flex items-baseline justify-between w-full md:w-auto">
                        <div className="flex flex-col gap-1 md:gap-2">
                          <h1 className="text-2xl md:text-3xl lg:text-4xl text-foreground font-bold">
                            {isSearchQuery ? `${convertToNormalCase(searchQuery ?? "")} Results` : `All Products`}
                          </h1>
                          <p className="text-foreground/80 mt-1 text-sm md:text-base">
                            Showing <span>{totalItems}</span> products
                          </p>
                        </div>

                        <div className="flex items-center justify-center gap-2 md:hidden">
                          {/* Filter button */}
                          <button
                              type="button"
                              onClick={() => setShowFilters(true)}
                              className="flex items-center gap-2 p-2 text-sm font-semibold"
                          >
                            <span aria-hidden="true"><FaFilter className="size-4" /></span>
                          </button>
                          {/* Sort button */}
                          <button
                              type="button"
                              onClick={() => setShowSortOptions(true)}
                              className="flex items-center gap-2 p-2 text-sm font-semibold"
                          >
                            <span aria-hidden="true"><FaSort className="size-4" /></span>
                          </button>
                        </div>
                    </div>
                        
                    {/* Sort by button */}
                    <div className="hidden md:block relative rounded-lg border border-foreground/20 px-2 py-1">
                        <select
                          className="text-sm font-semibold bg-transparent"
                          value={selectedSort}
                          onChange={(event) => handleSortChange(event.target.value as SortValue)}
                        >
                          {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                    </div>
                </div>

                {/* Main Products view */}
                <div className="flex flex-col gap-6">
                  {products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 xl:grid-cols-5 py-4 md:py-6 lg:py-8">
                      {products.map((product) => (
                        <ProductCard 
                          key={product.id} 
                          id={product.id ?? ''} 
                          name={product.title ?? 'Untitled Product'} 
                          storeName={product.store_name ?? 'Unknown Store'} 
                          price={product.price ?? 0} 
                          imageUrl={product.image_url ?? ''} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <p className="text-lg font-medium text-foreground/70">No products found</p>
                      <p className="mt-2 text-sm text-foreground/50">Try adjusting your filters or search criteria</p>
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}

                  {/* Pagination Control */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="rounded-lg border border-border/70 p-2 font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <div className="flex items-center gap-1">
                        {visiblePageNumbers[0] > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => handlePageChange(1)}
                              className="rounded-lg border border-border/70 px-3 py-1.5 font-semibold transition hover:bg-muted"
                            >
                              1
                            </button>
                            {visiblePageNumbers[0] > 2 && <span className="px-1 text-muted-foreground">…</span>}
                          </>
                        )}

                        {visiblePageNumbers.map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => handlePageChange(page)}
                            className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                              currentPage === page 
                                ? "bg-primary text-primary-foreground" 
                                : "border border-border/70 hover:bg-muted"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages && (
                          <>
                            {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages - 1 && (
                              <span className="px-1 text-muted-foreground">…</span>
                            )}
                            <button
                              type="button"
                              onClick={() => handlePageChange(totalPages)}
                              className="rounded-lg border border-border/70 px-3 py-1.5 font-semibold transition hover:bg-muted"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="rounded-lg border border-border/70 p-2 font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </div>
            </div>
        </main>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 md:hidden" onClick={() => setShowFilters(false)}>
          <div
            className="w-full rounded-t-3xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-end">
              <button type="button" onClick={() => setShowFilters(false)} className="text-sm font-medium text-foreground">
                Close
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto pr-1">
              <FilterControls
                filters={filters}
                options={{
                  universities: filterOptions.universities,
                  categories: filterOptions.categories,
                  ratingOptions: RATING_OPTIONS,
                }}
                onPriceChange={handlePriceChange}
                onToggleMulti={handleToggleMulti}
                onRatingChange={handleRatingChange}
                onReset={handleResetFilters}
                groupId="mobile"
              />
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}

      {showSortOptions && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 md:hidden" onClick={() => setShowSortOptions(false)}>
          <div
            className="w-full rounded-t-3xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sort By</h3>
              <button type="button" onClick={() => setShowSortOptions(false)} className="text-sm font-medium text-foreground">
                Close
              </button>
            </div>
            <div className="space-y-2">
              {SORT_OPTIONS.map((option) => {
                const isActive = option.value === selectedSort;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSortChange(option.value)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isActive && <span aria-hidden="true">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default IndexPage;