import React from 'react'
import type { Route } from './+types/$productId'
import type { Database } from '~/utils/database.types'
import { Loader } from 'lucide-react';
import { FaWhatsapp, FaRegHeart, FaStar } from "react-icons/fa6";
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { data, Form, Link } from 'react-router';
import ProductCard from '~/components/marketplace/ProductCard';
import RatingsTileSection from '~/components/marketplace/RatingsTile';
import { ReviewCard } from '~/components/marketplace/ReviewCard';

import { dummyReviews } from '~/components/marketplace/ReviewCard';

export const meta = ({ loaderData }: Route.MetaArgs) => {
  
  if (!loaderData?.product) {
    return [
      { title: 'Product Not Found - Campus Marketplace' },
      { name: 'description', content: 'This product could not be found.' },
    ]
  }

  const { product } = loaderData

  return [
    { title: `Buy ${product.title} - Campus Marketplace` },
    { name: "description", content: product.description || "Here's an item being sold on Campus Marketplace" },
    { name: "keywords", content: "campus marketplace, buy, sell, products, campus essentials" }
  ]
}

export async function loader({params, request}: Route.LoaderArgs) {

    const productId = params.productId;
    if (!productId) {
      throw new Response("Product ID is required", { status: 400 });
    }

    const { supabase, headers } = createSupabaseServerClient(request);

    // Fetch product details
    console.log('Fetching product details for ID:', productId);
    const { data: product, error: productError } = await supabase
      .from('product_detail_view')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      console.error('Error fetching product details:', productError);
      throw new Response("Product Not Found", { status: 404 });
    }

    // Fetch product reviews


    // Fetch Related Products
  const { data: related_products_view, error: related_products_error } = await supabase
    .from('related_products_view')
    .select('*')
    .eq('product_id', productId)
    .maybeSingle();
  
  if (related_products_error) {
      console.error('Error fetching related products:', related_products_error);
  }

  // If related products were gotten, we need the product data for each cuz the DB only returns their ID
  const relatedProductsIds = related_products_view?.related_product_ids ?? [];
  const relatedProducts: typeof product[]= []

  const { data: relatedProductsData, error: relatedProductsError } = await supabase
    .from('product_detail_view')
    .select('*')
    .in('id', relatedProductsIds );
  if (relatedProductsError) {
      console.error('Error fetching related products details:', relatedProductsError);
  } else {
      relatedProducts.push(...(relatedProductsData));
  }

    return data({product, relatedProducts}, { headers });
}

export function HydrateFallback(){
    return <Loader />;
}

const ProductPage = ({loaderData}: Route.ComponentProps) => {
    
  const { product, relatedProducts } = loaderData;

  return (
    <main>
      <section id='product-detail' className="lg:max-h-[90vh]">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>

          {/* Main Product Details */}
          <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {/* Product Image */}
              <div className='w-full max-h-[70dvh] overflow-hidden rounded-lg'>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.title ?? "Product Image"} className='w-full h-auto object-cover rounded-lg' />
                ) : (
                  <div className='w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg'>
                    <span className='text-foreground/50'>No Image Available</span>
                  </div>
                )}
              </div>
              {/* Product Info */}
              <div className='w-full flex flex-col lg:justify-between gap-6 md:pb-8'>
                <div className='flex flex-col'>
                  <div className='mb-4'>
                    {/* Store Name and university */}
                    <Link to={`/marketplace/vendors/${product.store_id}`} className='text-sm md:text-base text-foreground/80 font-medium hover:underline'>
                      {product.store_name} - {product.store_university}
                    </Link>
                  </div>
                  <h1 className='text-3xl md:text-4xl lg:text-5xl text-foreground font-bold mb-2 md:mb-4'>
                    {product.title}
                  </h1>
                  <p className='text-base text-foreground/80 mb-6'>{product.description}</p>
                </div>

                <div className='flex flex-col'>
                  {/* Price */}
                  <div className='mb-4 md:mb-6 px-2 flex gap-1 items-center'>
                    <h3 className='font-bold text-xl md:text-2xl lg:text-3xl text-foreground'>Price: </h3>
                    <p className='text-xl md:text-2xl lg:text-3xl font-normal text-foreground'>₦ {(product.price ?? 0)}</p>
                  </div>
                  <div className='flex flex-col gap-2 items-center w-full'>
                  <a 
                    href={`https://wa.me/${product.store_whatsapp_number}?text=I'm%20interested%20in%20buying%20the%20${encodeURIComponent(product.title ?? "this product")}%20that%20you%20have%20listed%20on%20Campus%20Marketplace.`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className='px-6 py-3 bg-primary text-primary-foreground rounded-full w-full flex gap-2 items-center justify-center'
                  >
                    <FaWhatsapp size={20} />
                    Contact Seller
                  </a>
                  <Form method="post" className='w-full'>
                    {/* Add to Wishlist */}
                    <button 
                      type="submit" 
                      value={product.id ?? ""}
                      disabled 
                      className='px-6 py-3 border-2 border-foreground text-foreground rounded-full w-full flex gap-2 items-center justify-center'
                    >
                      <FaRegHeart size={20} />
                      Add to Wishlist
                    </button>
                  </Form>
                </div>
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
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className='text-2xl font-bold mb-8 text-center'>Related Products</h2>
            {/* Related products grid */}
            <div className='-mx-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]'>
              <div className='mx-4 flex gap-6 snap-x snap-mandatory no-scrollbar-new'>
                {/* Placeholder for related products */}
                {relatedProducts.map((product, index) => (
                  <div className='snap-start shrink-0 w-64'>
                    <ProductCard
                      key={index}
                      id={product.id ?? ""}
                      name={product.title ?? ""}
                      storeName={product.store_name ?? ""}
                      price={product.price ?? 0}
                      imageUrl={product.image_url ?? ""}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
      </section>
    </main>
  )
}

export default ProductPage