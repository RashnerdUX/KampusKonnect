import {useEffect, useState} from 'react'
import type { Route } from './+types/$productId'
import { Loader } from 'lucide-react';
import { FaWhatsapp, FaRegHeart, FaStar, FaHeart } from "react-icons/fa6";
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { data, Form, Link, redirect, useRouteLoaderData } from 'react-router';
import ProductCard from '~/components/marketplace/ProductCard';
import RatingsTileSection from '~/components/marketplace/RatingsTile';
import { ReviewCard } from '~/components/marketplace/ReviewCard';
import RegistrationModal from '~/components/auth/RegistrationModal';

export const meta = ({ loaderData }: Route.MetaArgs) => {
  
  if (!loaderData?.product) {
    return [
      { title: 'Product Not Found - Campus Marketplace' },
      { name: 'description', content: 'This product could not be found.' },
    ]
  }

  const { product } = loaderData

  return [
    { title: `Buy ${product.title} - Campex Marketplace` },
    { name: "description", content: `${product.description}. Available for ₦${product.price} only from ${product.store_name} at ${product.store_university}.` || "Here's an item being sold on Campex Marketplace" },
    { name: "keywords", content: "campex, campus marketplace, buy, sell, products, campus essentials" },

    // OG Social Media tags
    // For Facebook, Whatsapp, LinkedIn
    { property: "og:title", content: product.title},
    { property: "og:description", content: `Only ₦${product.price} at ${product.store_name}`},
    { property: "og:image", content: product.image_url || "https://campex-marketplace.s3.amazonaws.com/default-product-image.png" },
    { property: "og:type", content: "product" },

    // For twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: product.title },
    { name: "twitter:description", content: `Only ₦${product.price} at ${product.store_name}` },
    { name: "twitter:image", content: product.image_url || "https://campex-marketplace.s3.amazonaws.com/default-product-image.png"},
  ]
}

export async function loader({params, request}: Route.LoaderArgs) {

    const productId = params.productId;
    if (!productId) {
      throw new Response("Product ID is required", { status: 400 });
    }

    const { supabase, headers } = createSupabaseServerClient(request);

    const [product, wishlistCheck] = await Promise.all(
      [
        supabase
      .from('product_detail_view')
      .select('*')
      .eq('id', productId)
      .single(),

      supabase
      .from('wishlists')
      .select('*')
      .eq('product_id', productId)
      .maybeSingle(),
      ]
    )

    if (product.error || !product) {
      console.error('Error fetching product details:', product.error);
      throw new Response("Product Not Found", { status: 404 });
    }

    // Fetch reviews summary and related products in parallel
    const [reviewsSummaryResult, relatedProductsResult] = await Promise.all([
      supabase
        .from('product_reviews_summary_view')
        .select('*')
        .eq('product_id', productId)
        .maybeSingle(),
      supabase
        .from('related_products_view')
        .select('*')
        .eq('product_id', productId)
        .maybeSingle()
    ]);

    if (reviewsSummaryResult.error) {
      console.error('Error fetching product reviews summary:', reviewsSummaryResult.error);
    }

    if (relatedProductsResult.error) {
      console.error('Error fetching related products:', relatedProductsResult.error);
    }

    const reviewsSummary = reviewsSummaryResult.data;
    const topReviewsIDs = reviewsSummary?.top_reviews ?? [];
    const relatedProductsIds = relatedProductsResult.data?.related_product_ids ?? [];

    // Fetch top reviews and related products data in parallel
    const [topReviewsResult, relatedProductsDataResult] = await Promise.all([
      topReviewsIDs.length > 0
        ? supabase
            .from('product_user_reviews_view')
            .select('*')
            .in('review_id', topReviewsIDs)
            .order('created_at', { ascending: false })
            .limit(4)
        : Promise.resolve({ data: [], error: null }),
      relatedProductsIds.length > 0
        ? supabase
            .from('product_detail_view')
            .select('*')
            .in('id', relatedProductsIds)
        : Promise.resolve({ data: [], error: null })
    ]);

    if (topReviewsResult.error) {
      console.error('Error fetching product user reviews:', topReviewsResult.error);
    }

    if (relatedProductsDataResult.error) {
      console.error('Error fetching related products details:', relatedProductsDataResult.error);
    }

    return data({
      product: product.data,
      relatedProducts: relatedProductsDataResult.data ?? [],
      reviewsSummary: reviewsSummary ?? null,
      topProductReviews: topReviewsResult.data ?? [],
      isInWishlist: !!wishlistCheck.data
    }, { headers });
}

export async function action({ request, params }: Route.ActionArgs) {
    const formData = await request.formData();
    const actionType = formData.get('wishlist-button');
    const productId = params.productId;
    const { supabase, headers } = createSupabaseServerClient(request);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw redirect('/login');
    }

    let error;

    if (actionType === 'remove-from-wishlist') {
      // Remove from wishlist if product is already in wishlist
      ({ error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId));
      
        console.log('Removed from wishlist');
    } else if (actionType === 'add-to-wishlist') {
      // Add to wishlist
      ({ error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          product_id: productId,
        }));

        console.log('Added to wishlist');
    }

    if (error) {
      console.error('Error adding to wishlist:', error);
      return data({ success: false, message: 'Failed to add to wishlist. Please try again later.' }, { headers });
    }

    return data({ success: true, message: 'Product added to wishlist.' }, { headers });
}

export function HydrateFallback(){
    return <Loader />;
}

const ProductPage = ({loaderData, actionData}: Route.ComponentProps) => {
  
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { product, relatedProducts, reviewsSummary, topProductReviews, isInWishlist } = loaderData;

  const { success, message } = actionData || {};

  // Get the user from the layout route
  const { user } = useRouteLoaderData("market-layout");

  // Set the Vendor Contact URL
  const whatsappUrl = `https://wa.me/${product.store_whatsapp_number}?text=I'm%20interested%20in%20buying%20the%20${encodeURIComponent(product.title ?? "this product")}%20that%20you%20have%20listed%20on%20Campex%20Marketplace.`;

  useEffect(() => {
    if (isInWishlist) {
      setIsAddedToWishlist(true);
    } else if (!isInWishlist) {
      setIsAddedToWishlist(false);
    };
  }, [actionData, isInWishlist]);

  const handleContactVendorClick = () => {
    console.log("Contact Vendor clicked")

    if (!user) {
      // Show the modal if not logged in
      console.log("User not logged in")
      setShowAuthModal(true);
    } else {
      // User is logged in, send them to WhatsApp
      console.log("User logged in. Going to Whatsapp")
      window.location.href = whatsappUrl;
    }
  };

    const ratingsData = [
    { star: 5, count: reviewsSummary?.count_5 || 0, totalReviews: reviewsSummary?.total_reviews || 0 },
    { star: 4, count: reviewsSummary?.count_4 || 0, totalReviews: reviewsSummary?.total_reviews || 0 },
    { star: 3, count: reviewsSummary?.count_3 || 0, totalReviews: reviewsSummary?.total_reviews || 0 },
    { star: 2, count: reviewsSummary?.count_2 || 0, totalReviews: reviewsSummary?.total_reviews || 0 },
    { star: 1, count: reviewsSummary?.count_1 || 0, totalReviews: reviewsSummary?.total_reviews || 0 },
  ]

  return (
    <main>
      <section id='product-detail' className="lg:max-h-[90vh]">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>

          {/* Render Modal conditionally */}
          {showAuthModal && (
            <RegistrationModal 
              onClose={() => setShowAuthModal(false)} 
              redirectLink={whatsappUrl} 
            />
          )}

          {/* Main Product Details */}
          <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {/* Product Image */}
              <div className='w-full max-h-[70dvh] overflow-hidden rounded-lg'>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.title ?? "Product Image"} className='w-full h-auto object-cover object-center rounded-lg' />
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
                  <button 
                    type='button'
                    onClick={handleContactVendorClick}
                    className='cursor-pointer px-6 py-3 bg-primary text-primary-foreground rounded-full w-full flex gap-2 items-center justify-center'
                  >
                    <FaWhatsapp size={20} />
                    Contact Seller
                  </button>
                  <Form method="post" className='w-full'>
                    {/* Add to Wishlist */}
                    { isAddedToWishlist ? (<button 
                      type="submit" 
                      name="wishlist-button"
                      value="remove-from-wishlist" 
                      className='px-6 py-3 border-2 border-foreground text-foreground rounded-full w-full cursor-pointer transition-all duration-300'
                    >
                      <div className='flex gap-2 items-center justify-center'>
                        <FaHeart size={20} className='text-red-600 dark:text-red-800' />
                        <span>Added to Wishlist</span>
                      </div>
                    </button>) : (<button 
                      type="submit" 
                      name="wishlist-button"
                      value="add-to-wishlist"
                      className='px-6 py-3 border-2 border-foreground text-foreground rounded-full w-full cursor-pointer transition-all duration-300'
                    >
                      <div className='flex gap-2 items-center justify-center'>
                        <FaRegHeart size={20} />
                        <span>Add to Wishlist</span>
                      </div>
                    </button>)}
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
                      <div className='flex flex-col items-center'>
                        <FaStar className='text-yellow-400 mb-4 text-2xl md:text-4xl lg:text-6xl' />
                        <h3 className='text-foreground text-3xl md:text-5xl lg:text-7xl font-bold mb-2'>
                          {reviewsSummary?.average_rating?.toFixed(1) ?? '0.0'} 
                          <span className='text-foreground/50 font-medium text-base md:text-lg lg:text-xl'> / 5</span>
                        </h3>
                        <p className='text-foreground/80 text-xs md:text-sm lg:text-base font-medium'>
                          Based on {reviewsSummary?.total_reviews ?? 0} reviews
                        </p>
                      </div>
                  </div>
                  <div className='flex items-center mx-auto'>
                    <RatingsTileSection ratings={ratingsData} />
                  </div>
              </div>

              {/* Reviews List */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                  {topProductReviews.length > 0 ? (
                    topProductReviews.map((review) => (
                      <ReviewCard
                        key={review.review_id}
                        username={review.username ?? 'Anonymous'}
                        name={review.full_name ?? 'Anonymous'}
                        avatarUrl={review.avatar_url}
                        review={review.review_text ?? ''}
                        rating={review.rating ?? 0}
                      />
                    ))
                  ) : (
                    <p className='text-foreground/60 col-span-full text-center py-8'>
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}
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
                  <div key={product.id || index} className='snap-start shrink-0 w-64'>
                    <ProductCard
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