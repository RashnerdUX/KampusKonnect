import React from 'react'
import { Link } from 'react-router';

export interface ProductCardProps { 
  id: string;
  name: string;
  storeName: string;
  price: number | null;
  imageUrl?: string | null;
}

export const ProductCard = ({ id, name, storeName, price, imageUrl }: ProductCardProps) => {
  return (
    <Link to={`/products/${id}`} className='block'>
      <div className='border border-border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow duration-200'>
          {imageUrl ? (
              <img src={imageUrl} alt={name} className='w-full h-48 object-cover' />
          ) : (
              <div className='w-full h-48 bg-gray-200 flex items-center justify-center'>
                  <span className='text-gray-500'>No Image</span>
              </div>
          )}
          <div className='p-4'>
              <h3 className='text-lg font-semibold text-foreground mb-2'>{name}</h3>
              <p className='text-sm text-muted-foreground mb-1'>{storeName}</p>
              <p className='text-base font-bold text-foreground'>${price?.toFixed(2)}</p>
          </div>
      </div>
    </Link>
  )
}

export default ProductCard;
