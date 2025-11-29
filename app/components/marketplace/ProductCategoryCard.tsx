import React from 'react'
import { Link } from 'react-router';

interface ProductCategoryCardProps {
  // Define any props if needed in the future
  name: string;
  image: string;
  linkpath: string;
}

export const ProductCategoryCard = ({ name, image, linkpath }: ProductCategoryCardProps) => {
  return (
    <Link to={linkpath}>
        <div className='relative group'>
            <div className='relative h-32 w-48 bg-cover bg-center rounded-xl overflow-hidden flex items-center justify-center shadow-lg' style={{ backgroundImage: `url(${image})`}}>
                <div className='absolute inset-0 bg-black/40 rounded-xl p-4'></div>
                <div className='absolute left-2 bottom-2 p-2 rounded-full bg-card'>
                  <h2 className='text-xs font-semibold text-card-foreground group-hover:text-primary'>{name}</h2>
                </div>
            </div>
        </div>
    </Link >
  )
}
