import React from 'react'
import type { SearchRecommendation } from '~/types/search.types'
import { Search} from 'lucide-react'
import { useNavigate } from 'react-router';

type SearchResultTileProps = {
  item: SearchRecommendation
  index: number
  selectedIndex?: number
  setSelectedIndex?: (index: number) => void
  setShowRecommendations?: (value: boolean) => void
}


const SearchResultTile = ({searchresult}: {searchresult: SearchResultTileProps}) => {

    const { item, index, selectedIndex, setSelectedIndex, setShowRecommendations } = searchresult;
    const navigate = useNavigate();

  return (
    <li className='list-none'>
        <button
            type="button"
            onClick={() => {
                navigate(`/marketplace/products/${item.id}`)
                setShowRecommendations && setShowRecommendations(false)
            }}
            onMouseEnter={() => setSelectedIndex && setSelectedIndex(index)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
            selectedIndex === index ? 'bg-primary/10' : 'hover:bg-foreground/5'
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
  )
}

export default SearchResultTile;