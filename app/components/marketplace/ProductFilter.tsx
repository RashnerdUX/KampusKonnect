


export type Filters = {
  priceMin: string;
  priceMax: string;
  universities: string[];
  categories: string[];
  vendors: string[];
  productRating: string;
  vendorRating: string;
};

export type FilterMultiKey = "universities" | "categories" | "vendors";
export type RatingFilterKey = "productRating" | "vendorRating";

export const createDefaultFilters = (): Filters => ({
  priceMin: "",
  priceMax: "",
  universities: [],
  categories: [],
  vendors: [],
  productRating: "",
  vendorRating: "",
});

export const UNIVERSITY_OPTIONS = [
  "University of Lagos",
  "Lagos State University",
  "University of Ibadan",
  "Obafemi Awolowo University",
  "Covenant University",
];

export const CATEGORY_OPTIONS = [
  "Food & Beverages",
  "Books & Stationery",
  "Electronics",
  "Clothing & Accessories",
  "Health & Wellness",
  "Services",
];

export const RATING_OPTIONS = [
  { value: "4", label: "4 stars & up" },
  { value: "3", label: "3 stars & up" },
  { value: "2", label: "2 stars & up" },
  { value: "1", label: "1 star & up" },
];

export const FILTER_QUERY_KEYS = [
  "priceMin",
  "priceMax",
  "university",
  "category",
  "vendor",
  "productRating",
  "vendorRating",
] as const;

export const parseFiltersFromSearch = (search: string): Filters => {
  const params = new URLSearchParams(search);

  return {
    priceMin: params.get("priceMin") ?? "",
    priceMax: params.get("priceMax") ?? "",
    universities: params.getAll("university"),
    categories: params.getAll("category"),
    vendors: params.getAll("vendor"),
    productRating: params.get("productRating") ?? "",
    vendorRating: params.get("vendorRating") ?? "",
  };
};

export type FilterControlsProps = {
  filters: Filters;
  options: {
    universities: string[];
    categories: string[];
    vendors: string[];
    ratingOptions: { value: string; label: string }[];
  };
  onPriceChange: (field: "priceMin" | "priceMax", value: string) => void;
  onToggleMulti: (field: FilterMultiKey, value: string) => void;
  onRatingChange: (field: RatingFilterKey, value: string) => void;
  onReset: () => void;
  groupId?: string;
};

export const FilterControls = ({ filters, options, onPriceChange, onToggleMulti, onRatingChange, onReset, groupId }: FilterControlsProps) => {
  const productRatingGroupName = `${groupId ?? "filters"}-product-rating`;
  const vendorRatingGroupName = `${groupId ?? "filters"}-vendor-rating`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Filters</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-primary transition hover:text-primary/80"
        >
          Clear all
        </button>
      </div>

      <section className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Price range</p>
        <div className="flex items-center gap-3">
          <label className="flex-1 text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">Min</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={filters.priceMin}
              onChange={(event) => onPriceChange("priceMin", event.target.value)}
              placeholder="0"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="flex-1 text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">Max</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={filters.priceMax}
              onChange={(event) => onPriceChange("priceMax", event.target.value)}
              placeholder="500"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Universities</p>
        <div className="max-h-48 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
          {options.universities.map((university) => (
            <label key={university} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.universities.includes(university)}
                onChange={() => onToggleMulti("universities", university)}
                className="size-4 rounded border-border"
              />
              <span className="text-foreground/90">{university}</span>
            </label>
          ))}
          {options.universities.length === 0 && (
            <p className="text-xs text-foreground/50">No universities available</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Categories</p>
        <div className="max-h-48 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
          {options.categories.map((category) => (
            <label key={category} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => onToggleMulti("categories", category)}
                className="size-4 rounded border-border"
              />
              <span className="text-foreground/90">{category}</span>
            </label>
          ))}
          {options.categories.length === 0 && (
            <p className="text-xs text-foreground/50">No categories available</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Vendors</p>
        <div className="max-h-48 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
          {options.vendors.map((vendor) => (
            <label key={vendor} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.vendors.includes(vendor)}
                onChange={() => onToggleMulti("vendors", vendor)}
                className="size-4 rounded border-border"
              />
              <span className="text-foreground/90">{vendor}</span>
            </label>
          ))}
          {options.vendors.length === 0 && (
            <p className="text-xs text-foreground/50">No vendors available</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Product rating</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={productRatingGroupName}
              checked={filters.productRating === ""}
              onChange={() => onRatingChange("productRating", "")}
              className="size-4 border-border"
            />
            <span className="text-foreground/90">Any rating</span>
          </label>
          {options.ratingOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={productRatingGroupName}
                value={option.value}
                checked={filters.productRating === option.value}
                onChange={() => onRatingChange("productRating", option.value)}
                className="size-4 border-border"
              />
              <span className="text-foreground/90">{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Vendor rating</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={vendorRatingGroupName}
              checked={filters.vendorRating === ""}
              onChange={() => onRatingChange("vendorRating", "")}
              className="size-4 border-border"
            />
            <span className="text-foreground/90">Any rating</span>
          </label>
          {options.ratingOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={vendorRatingGroupName}
                value={option.value}
                checked={filters.vendorRating === option.value}
                onChange={() => onRatingChange("vendorRating", option.value)}
                className="size-4 border-border"
              />
              <span className="text-foreground/90">{option.label}</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FilterControls;
