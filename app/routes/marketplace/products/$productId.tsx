import React from 'react'
import type { Route } from './+types/$productId'
import type { Database } from '~/utils/database.types'
import { Loader } from 'lucide-react';
import { FaWhatsapp, FaRegHeart, FaStar } from "react-icons/fa6";
import ProductCard from '~/components/marketplace/ProductCard';
import RatingsTileSection from '~/components/marketplace/RatingsTile';
import { ReviewCard } from '~/components/marketplace/ReviewCard';

import { dummyReviews } from '~/components/marketplace/ReviewCard';

type StoreListing = Database['public']['Tables']['store_listings']['Row'];

export const meta = (_args: Route.MetaArgs) => {

  const { product } = _args.loaderData

  return [
    { title: `Buy ${product.title} - Campus Marketplace` },
    { name: "description", content: product.description || "Here's an item being sold on Campus Marketplace" },
    { name: "keywords", content: "campus marketplace, buy, sell, products, campus essentials" }
  ]
}

export async function loader({params}: Route.LoaderArgs) {

    const productId = params.productId;

    // Run and search for the product in the database using the productId
    // For now, we will return a sample object that reflects the Database
    const sampleProduct: StoreListing = {
        id: productId || '1',
        store_id: 'WatchGalleries',
        title: 'Casio Digital Quartz Black Stainless Steel Unisex Watch',
        description: 'A sleek and stylish Casio digital quartz watch with a black stainless steel band, perfect for everyday wear.',
        price: 1999,
        image_url: "/images/casio-watch.jpg",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
    };

    return {product: sampleProduct};
}

export function HydrateFallback(){
    return <Loader />;
}

const ProductPage = ({loaderData}: Route.ComponentProps) => {
    
  const { product } = loaderData;
  return (
    <main>
      <section id='product-detail'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>

          {/* Main Product Details */}
          <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {/* Product Image */}
              <div>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.title} className='w-full h-auto object-cover rounded-lg' />
                ) : (
                  <div className='w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg'>
                    <span className='text-foreground/50'>No Image Available</span>
                  </div>
                )}
              </div>
              {/* Product Info */}
              <div className='w-full'>
                <h1 className='text-3xl text-foreground font-bold mb-2 md:mb-4'>{product.title}</h1>
                <p className='text-base text-foreground/80 mb-6'>{product.description}</p>

                <p className='text-xl text-foreground mb-4 md:mb-6'>${(product.price / 100).toFixed(2)}</p>
                
                <div className='flex flex-col gap-2 items-center w-full'>
                  <button type="button" className='px-6 py-3 bg-primary text-primary-foreground rounded-full w-full flex gap-2 items-center justify-center'>
                    <FaWhatsapp size={20} />
                    Contact Seller
                  </button>
                  <button type="button" className='px-6 py-3 border-2 border-foreground text-foreground rounded-full w-full flex gap-2 items-center justify-center'>
                    <FaRegHeart size={20} />
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id='product-reviews'>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className='text-2xl font-bold mb-8 text-center'>Customer Reviews</h2>
            <div className='flex flex-col md:flex-row gap-8'>
              {/* Reviews Summary */}
              <div className='relative border border-border bg-card flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 rounded-lg'>
                  <div className="flex flex-col">
                    {/* Actual summary */}
                      <div className='flex flex-col items-center'>
                        <FaStar className='text-yellow-400 mb-4 text-2xl md:text-4xl lg:text-6xl' />
                        <h3 className='text-foreground text-3xl md:text-5xl lg:text-7xl font-bold mb-2'>
                          4.6 <span className='text-foreground/50 font-medium text-base md:text-lg lg:text-xl'> / 5</span>
                        </h3>
                        <p className='text-foreground/80 text-xs md:text-sm lg:text-base font-medium'>Based on 120 reviews</p>
                      </div>
                  </div>
                  <div className='flex items-center mx-auto'>
                    <RatingsTileSection />
                  </div>
              </div>

              {/* Reviews List */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                  {dummyReviews.map((review, index) => (
                    <ReviewCard
                      key={index}
                      username={review.username}
                      name={review.name}
                      avatarUrl={review.avatarUrl}
                      review={review.review}
                      rating={review.rating}
                    />
                  ))}
              </div>
            </div>
          </div>
      </section>

      <section id='related-products'>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className='text-2xl font-bold mb-8 text-center'>Related Products</h2>
            {/* Related products grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {/* Placeholder for related products */}
              {[1,2,3,4].map((_, index) => (
                <ProductCard
                  key={index}
                  id={`related-product-${index + 1}`}
                  name={`Related Product ${index + 1}`}
                  storeName="Sample Store"
                  price={1999}
                  imageUrl="/images/sample-product.jpg"
                />
              ))}
            </div>
          </div>
      </section>
    </main>
  )
}

export default ProductPage