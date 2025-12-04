import React from 'react'
import { Link } from 'react-router';

export interface ProductCardProps { 
  id: string;
  name: string;
  storeName: string;
  price: number;
  imageUrl?: string | null;
  rating?: number;
  applyBadge?: boolean;
  badgeText?: string;
}

export const ProductCard = ({ id, name, storeName, price, imageUrl, rating, badgeText, applyBadge }: ProductCardProps) => {
  return (
    <Link to={`/marketplace/products/${id}`} className='block h-full'>
      <div className='relative flex h-full flex-col border border-border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-shadow duration-200'>
        {/* The image container */}
        <div className='p-2'>
          <img src={imageUrl ?? '/images/product-placeholder.png'} alt={name} className='rounded-lg object-cover w-full h-48' loading='lazy' />
        </div>

        {/* The text container */}
        <div className='flex flex-1 items-end justify-between p-2 lg:p-4'>
          {/* Main text */}
          <div className='flex flex-col gap-1 min-w-0 flex-1'>
            <span className='text-xs text-foreground/70 truncate'>{storeName}</span>
            <span className='font-medium text-foreground text-base lg:text-xl line-clamp-2'>{name}</span>
            <span className='mt-1 font-bold text-foreground text-lg lg:text-2xl'>₦ {price}</span>
          </div>

          {/* Review text */}
          <div className='flex items-center justify-center gap-1 flex-shrink-0 ml-2'> 
            <span className='text-foreground/90 text-sm lg:text-base'>{rating ?? '0.0'}</span>
            <svg className='size-4 text-yellow-300 dark:text-yellow-500' viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>

        {/* Badge - only render when applyBadge is true */}
        {applyBadge && badgeText && (
          <div className='absolute top-4 left-4 bg-primary text-primary-foreground text-sm font-semibold px-2.5 py-1 rounded-md z-10'>
            {badgeText}
          </div>
        )}
      </div>
    </Link>
  )
}

export default ProductCard;
