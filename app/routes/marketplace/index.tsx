import React from 'react'
import type { Route } from "../marketplace/+types/index";
import SearchBar from '~/components/marketplace/SearchBar';
import { ProductCategoryCard } from '~/components/marketplace/ProductCategoryCard';
import ProductCard from '~/components/marketplace/ProductCard';
import Footer from '~/components/Footer';
import { HomeSectionProductView } from '~/components/marketplace/HomeSectionProductView';

import { stockProducts, featuredProducts } from '~/utils/stockdata';


export const meta = (_args: Route.MetaArgs) => {
  return [
    { title: "Campus Marketplace - Campex" },
    { name: "description", content: ""},
    { name: "keywords", content: ""}
  ]
}

export const IndexPage = () => {

  const productCategories = [
    { name: 'Food & Beverages', image: '/images/categories/food&beverages.jpg', link: '/categories/food-beverages' },
    { name: 'Books & Stationery', image: '/images/categories/books&stationeries.jpg', link: '/categories/books-stationery' },
    { name: 'Electronics', image: '/images/categories/electronics.jpg', link: '/categories/electronics' },
    {name: 'Clothing & Accessories', image: '/images/categories/clothing&accessories.jpg', link: '/categories/clothing-accessories' },
    { name: 'Health & Wellness', image: '/images/categories/health&wellness.jpg', link: '/categories/health-wellness' },
    { name: 'Services', image: '/images/categories/services.jpg', link: '/categories/services' },
  ]


  return (
    <>
      <main>
        <section id="marketplace-hero" className="relative bg-secondary pt-16 pb-10 lg:pb-28 lg:pt-20">
            {/* The main container for hero */}
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 lg:mb-0'>
                {/* Text content for the hero section */}
                <div className='max-w-xl md:max-w-2xl mx-auto'>
                  <h1 className=' text-secondary-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-display'> Shop smarter with Campex</h1>
                  <p className='mt-4 text-lg text-secondary-foreground/80'>Discover a world of campus essentials at unbeatable prices. From textbooks to tech gadgets, find everything you need in one place.</p>
                </div>
              </div>

            {/* The search bar */}
            <div className='md:absolute md:inset-x-0 lg:bottom-0 flex items-center justify-center px-4'>
              <div className='w-full max-w-5xl mx-auto lg:translate-y-1/2'>
                  <SearchBar />
              </div>
            </div>
        </section>

        <section id='product-categories' className='relative mt-12 md:mt-18 lg:mt-20'>
          {/* TODO: Shift the margin top according to how I need it */}
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <h2 className='text-2xl font-bold mb-8 text-center'>Browse by Category</h2>

            <div className='-mx-4 overflow-x-auto pb-4'>
              <div className='mx-4 flex gap-5'>
                {productCategories.map((category) => (
                  <ProductCategoryCard
                    key={category.name}
                    name={category.name}
                    image={category.image}
                    linkpath={category.link}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id='featured-products' className='relative mt-6 sm:mt-8 md:mt-10 lg:mt-12 bg-footer-background text-footer-foreground'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <h2 className='text-2xl font-bold mb-8 text-center'>Featured Products</h2>
            {/* Featured products grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {/* Placeholder for featured products */}
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={index}
                  name={product.name}
                  storeName={product.storeName}
                  price={product.price}
                  imageUrl={product.imageUrl}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="popular" className='relative mt-6 sm:mt-8 md:mt-10 lg:mt-12'>
          {/* Popular products section */}
          <HomeSectionProductView sectionTitle="Popular Items" seeAllLink="/products/popular" productData={stockProducts} />
        </section>

        <section id='for-you' className='relative mt-6 sm:mt-8 md:mt-10 lg:mt-12'>
          <HomeSectionProductView sectionTitle="For You" seeAllLink="/products/featured" productData={stockProducts} />
        </section>

        <section id='vendors' className='relative mt-6 sm:mt-8 md:mt-10 lg:mt-12'>

        </section>
      </main>

      <footer id="footer" className='relative py-6 bg-footer-background text-footer-foreground'>
        {/* Footer content */}
        <Footer />
      </footer>
    </>
  )
}

export default IndexPage;