import type { Route } from './+types/mobilesearchpage';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, ArrowLeft } from 'lucide-react';
import { useFetcher } from 'react-router';
import SearchResultTile from '~/components/marketplace/SearchResultTile';
import type { SearchRecommendation } from '~/types/search.types';
// Import debounce hook from main SearchBar component
import { useDebounce } from '~/components/marketplace/SearchBar';
import ButtonSpinner from '~/components/ButtonSpinner';
import { isMobileUserAgent } from '~/utils/guardMobileRoutes';
import { redirect } from 'react-router';


export const meta = () => {
  return [
    { title: "Search Products | Campex" },
    { name: "description", content: "Search for products, vendors, and categories on Campex." },
  ];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  if (!isMobileUserAgent(request)) {
    throw redirect('/marketplace');
  }
}

const SearchPage = ({ loaderData }: Route.ComponentProps) => {

  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce the search query for recommendations
  const debouncedQuery = useDebounce(searchQuery, 300)

  // Fetch recommendations when debounced query changes
  useEffect(() => {
      if (debouncedQuery.length >= 2) {
        const formData = new FormData()
        formData.set('q', debouncedQuery)
        formData.set('limit', '6')
        fetcher.submit(formData, { method: 'POST', action: '/api/search' })
      }
      
  }, [debouncedQuery]);

  const recommendations: SearchRecommendation[] = fetcher.data?.recommendations || [];
  const isLoadingRecommendations = fetcher.state === 'submitting' || fetcher.state === 'loading';

  // Handle Search when the user clicks enter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    
    navigate(`/marketplace/products?${params.toString()}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Mobile Search Header */}
      <div className='lg:hidden sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-border'>
        <div className='px-4 py-3 flex items-center gap-2'>
          <button
            onClick={handleBack}
            className='p-2 hover:bg-muted rounded-lg transition-colors'
          >
            <ArrowLeft size={24} />
          </button>
          <form onSubmit={handleSearch} className='flex-1 relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search products...'
              className='w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary'
              autoFocus
            />
            <button
              type='submit'
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground'
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='lg:hidden px-4 py-4'>
        {isLoadingRecommendations ? 
          <div className='my-auto flex flex-col items-center gap-2'>
            <ButtonSpinner />
            <p className='text-center text-sm text-muted-foreground'>Searching the marketplace...</p>
          </div> : recommendations.length > 0 ? (
          <div className='flex flex-col gap-4'>
            {recommendations.map((product, index) => (
              <SearchResultTile 
                key={product.id}
                searchresult={
                  {
                    item: product,
                    index: index,
                    selectedIndex: undefined,
                    setSelectedIndex: undefined,
                    setShowRecommendations: undefined,
                  }
                }
              />
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <Search size={48} className='mx-auto text-muted-foreground mb-4' />
            <h2 className='text-xl font-semibold text-foreground mb-2'>
              {searchQuery ? 'No results found' : 'Start searching'}
            </h2>
            <p className='text-sm text-muted-foreground'>
              {searchQuery
                ? `Try adjusting your search terms for "${searchQuery}"`
                : 'Enter a product name or category to begin'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;