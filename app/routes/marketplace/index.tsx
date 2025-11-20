import React from 'react'
import type { Route } from "../marketplace/+types/index";
import SearchBar from '~/components/marketplace/SearchBar';
import { ProductCategoryCard } from '~/components/marketplace/ProductCategoryCard';

export const IndexPage = () => {

  const productCategories = [
    { name: 'Food & Beverages', image: '/images/categories/food&beverages.jpg', link: '/categories/food-beverages' },
    { name: 'Books & Stationery', image: '/images/categories/books&stationeries.jpg', link: '/categories/books-stationery' },
  ]
  return (
    <main>
      <section id="marketplace-hero" className="py-20 bg-gray-100">
        <div className='relative'>
          {/* The main container for hero */}
          <div className='relative py-4 sm:py-8 lg:py-12 flex flex-col items-center justify-center'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
              {/* Text content for the hero section */}
              <div className='max-w-xl md:max-w-2xl mx-auto'>
                <h1 className=' text-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-display'> Shop smarter with Campex</h1>
                <p className='mt-4 text-lg text-foreground'>Discover a world of campus essentials at unbeatable prices. From textbooks to tech gadgets, find everything you need in one place.</p>
              </div>
            </div>

            {/* The search bar */}
            <div className='absolute w-full top-full inset-x-0 mt-6 px-4 -translate-x-1/2 left-1/2 max-w-5xl'>
                <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <section id='product-categories' className='relative hidden'>
        <div className='relative'>
          {/* The Product Categories */}
          <div className=''>
            <div className='max-w-xl sm:max-w-2xl lg:max-w-7xl mx-auto'>
              <div className='mt-32 mb-12'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8'>
                  {productCategories.map((category) => (
                    <ProductCategoryCard key={category.name} name={category.name} image={category.image} linkpath={category.link} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default IndexPage;