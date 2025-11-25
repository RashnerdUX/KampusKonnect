import { useState } from "react";
import type { Route } from "../products/+types/index";
import { FaFilter } from "react-icons/fa6";
import { RxDividerVertical } from "react-icons/rx";

import { stockProducts } from "~/utils/stockdata";
import { index } from "@react-router/dev/routes";
import ProductCard from "~/components/marketplace/ProductCard";

export const meta = () => {
  return [
    { title: "Discover and purchase products from your favorite campus vendors with Campex" },
    { name: "description", content: ""},
    { name: "keywords", content: ""}
  ]
}

export async function loader({ }: Route.LoaderArgs) {
    // Get a list of products based on the client's query parameter
    return {};
}

export const IndexPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  return (
    <section className="py-4 sm:py-6 lg:py-8 min-h-screen">
      <div className="mx-auto flex w-full max-w-8xl flex-col gap-6 px-4 sm:px-6 lg:px-8 md:flex-row">
        <aside className="hidden w-full shrink-0 space-y-6 rounded-2xl bg-white p-4 shadow-sm lg:sticky lg:top-24 md:block md:w-50 lg:w-72">
          {/* filter controls */}
        </aside>

        <main className="flex-1 p-4">

            <div className="relative">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl text-foreground font-bold">Products</h1>
                        <p className="text-foreground/80 mt-1 text-sm md:text-base">
                            Showing <span>12348</span> vendors close to you
                        </p>
                    </div>
                        
                    {/* Sort by button */}
                    <div className="hidden md:block relative rounded-lg border border-foreground/20 px-2 py-1">
                        <select
                                className="text-sm font-semibold"
                                defaultValue="relevance"
                        >
                            <option value="relevance">Sort by Relevance</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                            <option value="newest">Newest Arrivals</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* product cards */}
                
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
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button type="button" onClick={() => setShowFilters(false)} className="text-sm font-medium text-foreground">
                Close
              </button>
            </div>
            {/* filter controls */}
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
            {/* sort options */}
          </div>
        </div>
      )}
    </section>
  )
}

export default IndexPage;