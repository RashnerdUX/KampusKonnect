import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useNavigate, useFetcher } from 'react-router'
import type { SearchRecommendation } from '~/types/search.types'

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  emoji?: string | null;
}

export interface UniversityOption {
  id: string;
  name: string;
  short_code: string | null;
}

interface SearchBarProps {
  placeholder?: string
  categories?: CategoryOption[]
  universities?: UniversityOption[]
  defaultQuery?: string
  defaultCategory?: string
  defaultUniversity?: string
  showFilters?: boolean
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export const SearchBar = ({ 
  placeholder, 
  categories = [], 
  universities = [],
  defaultQuery = '',
  defaultCategory = '',
  defaultUniversity = '',
  showFilters = true
}: SearchBarProps) => {
  const navigate = useNavigate()
  const fetcher = useFetcher()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState(defaultQuery)
  const [category, setCategory] = useState(defaultCategory)
  const [university, setUniversity] = useState(defaultUniversity)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Debounce the search query for recommendations
  const debouncedQuery = useDebounce(query, 300)

  // Recommendations from fetcher
  const recommendations: SearchRecommendation[] = fetcher.data?.recommendations || []
  const isLoadingRecommendations = fetcher.state === 'submitting' || fetcher.state === 'loading'

  // Fetch recommendations when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      const formData = new FormData()
      formData.set('q', debouncedQuery)
      formData.set('limit', '6')
      fetcher.submit(formData, { method: 'POST', action: '/api/search' })
    }
  }, [debouncedQuery])

  // Handle search submission
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (category) params.set('category', category)
    if (university) params.set('university', university)
    
    setShowRecommendations(false)
    navigate(`/marketplace/products?${params.toString()}`)
  }, [query, category, university, navigate])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && recommendations[selectedIndex]) {
        // Navigate to selected product
        navigate(`/marketplace/products/${recommendations[selectedIndex].id}`)
        setShowRecommendations(false)
      } else {
        handleSearch()
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < recommendations.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Escape') {
      setShowRecommendations(false)
      setSelectedIndex(-1)
    }
  }

  // Handle click outside to close recommendations
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowRecommendations(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset selected index when recommendations change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [recommendations])

  const placeholderText = placeholder || 'Search for textbooks, electronics, services, and more...'

  return (
    <div className="max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-5xl w-full">
      <div className="flex flex-col md:flex-row items-stretch bg-card rounded-xl shadow-md p-4 sm:p-6 lg:p-8 gap-4">
        {/* Search Input Section */}
        <div className="flex flex-col lg:w-[60%] w-full">
          <label htmlFor="search" className="text-base font-medium mb-2">
            Search
          </label>
          <div className="relative">
            <div className="relative flex items-center bg-foreground/5 rounded-lg overflow-visible">
              <input
                ref={inputRef}
                type="search"
                id="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setShowRecommendations(true)
                }}
                onFocus={() => {
                  if (query.length >= 2) setShowRecommendations(true)
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholderText}
                autoComplete="off"
                className="w-full border-none bg-transparent p-3 md:p-4 pr-24 text-foreground focus:outline-none focus:ring-0"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setShowRecommendations(false)
                    inputRef.current?.focus()
                  }}
                  className="absolute right-14 p-1 text-foreground/50 hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
              <button
                type="button"
                onClick={handleSearch}
                className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Search Recommendations Dropdown */}
            {showRecommendations && query.length >= 2 && (
              <div 
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
              >
                {isLoadingRecommendations ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-foreground/70">Searching...</span>
                  </div>
                ) : recommendations.length > 0 ? (
                  <ul className="py-2">
                    {recommendations.map((item, index) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            navigate(`/marketplace/products/${item.id}`)
                            setShowRecommendations(false)
                          }}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                            selectedIndex === index 
                              ? 'bg-primary/10' 
                              : 'hover:bg-foreground/5'
                          }`}
                        >
                          {/* Product Image */}
                          <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            {item.image_url ? (
                              <img 
                                src={item.image_url} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-foreground/30">
                                <Search size={16} />
                              </div>
                            )}
                          </div>
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {item.title}
                            </p>
                            <p className="text-xs text-foreground/60">
                              {item.category_name || 'Product'} • ₦{item.price.toLocaleString()}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                    {/* View all results button */}
                    <li className="border-t border-border mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleSearch}
                        className="w-full px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors text-center font-medium"
                      >
                        View all results for "{query}"
                      </button>
                    </li>
                  </ul>
                ) : (
                  <div className="p-4 text-center text-sm text-foreground/60">
                    No products found for "{query}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="flex flex-col md:flex-row lg:w-[40%] md:gap-4 w-full gap-4">
            {/* Category Filter */}
            <div className="flex flex-col w-full">
              <label htmlFor="category" className="text-base font-medium mb-2">
                Product Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-foreground/30 bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji ? `${cat.emoji} ${cat.name}` : cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* University Filter */}
            <div className="flex flex-col w-full">
              <label htmlFor="university" className="text-base font-medium mb-2">
                University
              </label>
              <select
                id="university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full rounded-lg border border-foreground/30 bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="">All Universities</option>
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.short_code || uni.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar