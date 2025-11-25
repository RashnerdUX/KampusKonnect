import { useEffect, useMemo, useState } from "react";
import type { Route } from "../products/+types/index";
import { FaFilter } from "react-icons/fa6";
import { RxDividerVertical } from "react-icons/rx";
import { useLocation, useNavigate } from "react-router";

import { storeListings, stockVendors } from "~/utils/stockdata";
import ProductCard from "~/components/marketplace/ProductCard";
import FilterControls, {
  parseFiltersFromSearch,
  createDefaultFilters,
  FILTER_QUERY_KEYS,
  RATING_OPTIONS,
  CATEGORY_OPTIONS,
  UNIVERSITY_OPTIONS,
} from "~/components/marketplace/ProductFilter";
import type { Filters, FilterMultiKey, RatingFilterKey } from "~/components/marketplace/ProductFilter";

const SORT_QUERY_KEY = "sort";

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

export const meta = () => {
  return [
    { title: "Discover and purchase products from your favorite campus vendors with Campex" },
    { name: "description", content: ""},
    { name: "keywords", content: ""}
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const pageParam = Number(url.searchParams.get("page") ?? 1);
    const sortParam = url.searchParams.get(SORT_QUERY_KEY) ?? DEFAULT_SORT;
    const sort = isSortValue(sortParam) ? sortParam : DEFAULT_SORT;
    const filters = parseFiltersFromSearch(url.search);

    const ITEMS_PER_PAGE = 12;
    const totalItems = storeListings.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const currentPage = Math.min(Math.max(1, Number.isNaN(pageParam) ? 1 : pageParam), totalPages);

    // Simulate sorting on the backend during development
    const vendorReviewMap = new Map(stockVendors.map((vendor) => [vendor.id, vendor.reviewCount ?? 0]));
    let sortedListings = [...storeListings];

    if (sort !== "relevance") {
      sortedListings = [...storeListings].sort((a, b) => {
        switch (sort) {
          case "price-low-high":
            return a.price - b.price;
          case "price-high-low":
            return b.price - a.price;
          case "newest":
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case "popular": {
            const aPopularity = vendorReviewMap.get(a.store_id) ?? 0;
            const bPopularity = vendorReviewMap.get(b.store_id) ?? 0;
            if (bPopularity !== aPopularity) {
              return bPopularity - aPopularity;
            }
            return b.price - a.price;
          }
          default:
            return 0;
        }
      });
    }

    // Simulate a paginated response from the backend during development
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const products = sortedListings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
        products,
        pagination: {
            currentPage,
            totalPages,
            totalItems,
            pageSize: ITEMS_PER_PAGE,
        },
        filters,
        sort,
    };
}

export const IndexPage = ({ loaderData }: Route.ComponentProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { products, pagination, filters: serverFilters, sort } = loaderData;
  const { currentPage, totalPages, totalItems } = pagination;
  const [filters, setFilters] = useState<Filters>(() => serverFilters ?? createDefaultFilters());
  const [selectedSort, setSelectedSort] = useState<SortValue>(sort ?? DEFAULT_SORT);

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

  const vendorOptions = useMemo(() => stockVendors.map((vendor) => vendor.name), []);

  const visiblePageNumbers = (() => {
    const delta = 2;
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);

    if (currentPage <= delta + 1) {
      end = Math.min(totalPages, 1 + delta * 2);
    }

    if (currentPage >= totalPages - delta) {
      start = Math.max(1, totalPages - delta * 2);
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
    nextFilters.vendors.forEach((value) => params.append("vendor", value));
    if (nextFilters.productRating) params.set("productRating", nextFilters.productRating);
    if (nextFilters.vendorRating) params.set("vendorRating", nextFilters.vendorRating);

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
        <aside className="hidden w-full shrink-0 space-y-6 rounded-2xl bg-white p-4 shadow-sm lg:sticky lg:top-24 md:block md:w-50 lg:w-72">
          <FilterControls
            filters={filters}
            options={{
              universities: UNIVERSITY_OPTIONS,
              categories: CATEGORY_OPTIONS,
              vendors: vendorOptions,
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
                    <div className="flex flex-col gap-1 md:gap-2">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl text-foreground font-bold">Products</h1>
                        <p className="text-foreground/80 mt-1 text-sm md:text-base">
                          Showing <span>{totalItems}</span> products
                        </p>
                    </div>
                        
                    {/* Sort by button */}
                    <div className="hidden md:block relative rounded-lg border border-foreground/20 px-2 py-1">
                        <select
                          className="text-sm font-semibold"
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
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 xl:grid-cols-5 py-4 md:py-6 lg:py-8">
                      {/* product cards */}
                      {products.map((product) => (
                        <ProductCard key={product.id} id={product.id} name={product.title} storeName={product.store_id} price={product.price} imageUrl={product.image_url} />
                      ))}
                  </div>

                  {/* Pagination Control */}
                  {totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border px-4 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="rounded-lg border border-border/70 px-3 py-1 font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>

                      <div className="flex items-center gap-2">
                        {visiblePageNumbers[0] !== 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => handlePageChange(1)}
                              className={`rounded-lg px-3 py-1 font-semibold transition hover:bg-muted ${
                                currentPage === 1 ? "bg-primary text-primary-foreground" : "border border-border/70"
                              }`}
                            >
                              1
                            </button>
                            {visiblePageNumbers[0] > 2 && <span className="px-1">…</span>}
                          </>
                        )}

                        {visiblePageNumbers.map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => handlePageChange(page)}
                            className={`rounded-lg px-3 py-1 font-semibold transition hover:bg-muted ${
                              currentPage === page ? "bg-primary text-primary-foreground" : "border border-border/70"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        {visiblePageNumbers[visiblePageNumbers.length - 1] !== totalPages && (
                          <>
                            {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages - 1 && <span className="px-1">…</span>}
                            <button
                              type="button"
                              onClick={() => handlePageChange(totalPages)}
                              className={`rounded-lg px-3 py-1 font-semibold transition hover:bg-muted ${
                                currentPage === totalPages ? "bg-primary text-primary-foreground" : "border border-border/70"
                              }`}
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="rounded-lg border border-border/70 px-3 py-1 font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>

                {/* Floating action buttons */}
                <div className="md:hidden absolute mt-auto flex items-center justify-center mx-auto bg-card rounded-full max-w-[160px] shadow-xs px-2">
                    {/* Filter button */}
                    <button
                        type="button"
                        onClick={() => setShowFilters(true)}
                        className="flex items-center gap-2 p-2 text-sm font-semibold"
                    >
                      <span>Filters</span>
                      <span aria-hidden="true"><FaFilter className="size-4" /></span>
                    </button>
                    {/* Line divider */}
                    <RxDividerVertical className="h-4 w-px bg-card-foreground mx-2" />
                    {/* Sort button */}
                    <button
                        type="button"
                        onClick={() => setShowSortOptions(true)}
                        className="flex items-center gap-2 p-2 text-sm font-semibold"
                    >
                      <span>Sort</span>
                      <span aria-hidden="true">⇅</span>
                    </button>
                </div>
            </div>
        </main>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 md:hidden" onClick={() => setShowFilters(false)}>
          <div
            className="w-full rounded-t-3xl bg-white p-6 shadow-xl"
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
                  universities: UNIVERSITY_OPTIONS,
                  categories: CATEGORY_OPTIONS,
                  vendors: vendorOptions,
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
            className="w-full rounded-t-3xl bg-white p-6 shadow-xl"
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