import React from 'react'
import { useNavigate, Link } from 'react-router';

interface ProductCategoryCardProps {
  // Define any props if needed in the future
  name: string;
  image: string;
  linkpath: string;
}

export const ProductCategoryCard = ({ name, image, linkpath }: ProductCategoryCardProps) => {
    const navigate = useNavigate();

  return (
    <Link to={linkpath}>
        <div className='relative group'>
            <div className='relative h-36 w-full bg-cover bg-center rounded-xl overflow-hidden flex items-center justify-center shadow-lg' style={{ backgroundImage: `url(${image})`}}>
                <div className='absolute inset-0 bg-black/40 rounded-xl p-4'></div>
                <h2 className='text-2xl font-semibold text-white group-hover:text-primary z-10'>{name}</h2>
            </div>
        </div>
    </Link >
  )
}
