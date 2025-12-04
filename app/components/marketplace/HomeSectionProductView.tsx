import React from 'react'
import { Link } from 'react-router'
import ProductCard from './ProductCard'

export interface SectionProductProps {
  product_id: string | null;
  product_name: string | null;
  store_name: string | null;
  price: number | null;
  product_image: string | null;
  product_rating: number | null;
  created_at?: string | null;
}

export interface HomeSectionProductViewProps {
  sectionTitle: string;
  seeAllLink: string;
  productData: SectionProductProps[];
}

export const HomeSectionProductView = ({ sectionTitle, seeAllLink, productData }: HomeSectionProductViewProps) => {
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4'>
      <div className='flex justify-between items-baseline mb-8'>
        <h2 className='text-2xl font-bold'>{sectionTitle}</h2>
        <Link to={seeAllLink}>See All</Link>
      </div>

      {productData && productData.length > 0 ? (
        <div className='relative'>
          <div className='-mx-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]'>
            <div className='mx-4 flex gap-6 snap-x snap-mandatory'>
              {productData.map((product) => (
                product.product_id && (
                  <div className='snap-start shrink-0 w-64' key={product.product_id}>
                    <ProductCard
                      id={product.product_id}
                      name={product.product_name ?? 'Unknown Product'}
                      storeName={product.store_name ?? 'Unknown Store'}
                      price={product.price ?? 0}
                      imageUrl={product.product_image}
                      rating={product.product_rating ?? 0}
                    />
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className='text-center text-foreground/60'>No products available.</p>
      )}
    </div>
  )
}

export default HomeSectionProductView;
