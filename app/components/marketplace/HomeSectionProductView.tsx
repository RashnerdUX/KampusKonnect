import React from 'react'
import { ProductCard } from './ProductCard'
import { Link } from 'react-router';

import type { ProductCardProps } from '~/components/marketplace/ProductCard';

interface HomeSectionProductViewProps {
    sectionTitle:  string;
    seeAllLink: string;
    productData:  ProductCardProps[];
}

export const HomeSectionProductView = ({ sectionTitle, seeAllLink, productData }: HomeSectionProductViewProps) => {
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4'>
            <div className='flex justify-between items-baseline mb-8'>
              <h2 className='text-2xl font-bold'>{sectionTitle}</h2>
              <Link to={seeAllLink} >See All</Link>
            </div>
            {/* Popular products grid */}
            <div className='relative'>
              <div className='-mx-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]'>
                <div className='mx-4 flex gap-6 snap-x snap-mandatory no-scrollbar-new'>
                  {/* Placeholder for popular products */}
                  {productData.map((product, index) => (
                    <div className='snap-start shrink-0 w-64' key={index}>
                      <ProductCard
                        key={index}
                        id={product.id}
                        name={product.name}
                        storeName={product.storeName}
                        price={product.price}
                        imageUrl={product.imageUrl}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
  )
}
