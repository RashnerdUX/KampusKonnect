import React from 'react'
import type { Route } from "../marketplace/+types/index";
import SearchBar, { type CategoryOption, type UniversityOption } from '~/components/marketplace/SearchBar';
import { ProductCategoryCard } from '~/components/marketplace/ProductCategoryCard';
import ProductCard from '~/components/marketplace/ProductCard';
import { HomeSectionProductView } from '~/components/marketplace/HomeSectionProductView';
import { VendorCard } from '~/components/marketplace/VendorCard';
import { Link, data, useOutletContext, useNavigate } from 'react-router';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { HeroIllustrations } from '~/components/marketplace/HeroIllustrations';

interface MarketplaceContext {
  categories: CategoryOption[];
  universities: UniversityOption[];
}


export const meta = (_args: Route.MetaArgs) => {
  return [
    { title: "Campus Marketplace - Campex" },
    { name: "description", content: ""},
    { name: "keywords", content: ""}
  ]
}

export const loader = async ({request}: Route.LoaderArgs) => {
  
  // Create the client
  const { supabase, headers } = createSupabaseServerClient(request);

  // Fetch all data in parallel
  const [
    featuredResult,
    latestResult,
    popularResult,
    recommendedResult,
    vendorsResult
  ] = await Promise.all([
    // Get the featured products
    supabase
      .from('featured_products_view')
      .select('*')
      .limit(4),
    
    // Get the latest products
    supabase
      .from('latest_products_view')
      .select('*')
      .range(0, 9),
    
    // Get popular products
    supabase
      .from('popular_products_view')
      .select('*')
      .order('created_at', { ascending: false })
      .range(0, 9),
    
    // Get recommended products for user
    supabase.rpc('recommended_products_for_user', {
      viewer_university_id: "13ccf813-ad11-46c9-93d4-a3018f0493a3"
    }),
    
    // Get top vendors
    supabase
      .from('vendor_view')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(8)
  ]);

  // Handle errors
  if (featuredResult.error) {
    console.error('Error fetching featured products:', featuredResult.error);
    throw new Response("Error fetching featured products", { status: 500 });
  }
  
  if (latestResult.error) {
    console.error('Error fetching latest products:', latestResult.error);
    throw new Response("Error fetching latest products", { status: 500 });
  }

  if (popularResult.error) {
    console.error('Error fetching popular products:', popularResult.error);
    throw new Response("Error fetching popular products", { status: 500 });
  }

  if (recommendedResult.error) {
    console.error('Error fetching recommended products:', recommendedResult.error);
    throw new Response("Error fetching recommended products", { status: 500 });
  }

  if (vendorsResult.error) {
    console.error('Error fetching top vendors:', vendorsResult.error);
    throw new Response("Error fetching top vendors", { status: 500 });
  }
  
  return data(
    {
      featuredProducts: featuredResult.data,
      latestProducts: latestResult.data,
      popularProducts: popularResult.data,
      recommendedProducts: recommendedResult.data,
      topVendors: vendorsResult.data,
    },
    { headers }
  );
}

export const IndexPage = ({loaderData}: Route.ComponentProps) => {

  const { featuredProducts, latestProducts, popularProducts, topVendors, recommendedProducts } = loaderData
  const { categories, universities } = useOutletContext<MarketplaceContext>();
  const navigate = useNavigate();

  const handleSearch = (query: string, category: string, university: string) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category && category !== 'all') params.set('category', category);
    if (university && university !== 'all') params.set('university', university);
    
    navigate(`/marketplace/products?${params.toString()}`);
  };

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
        <section id="marketplace-hero" className="relative bg-footer-background pt-16 pb-10 lg:pb-28 lg:pt-20 overflow-x-clip">
            {/* Floating Illustrations */}
            <HeroIllustrations />
            
            {/* The main container for hero */}
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 lg:mb-0 relative z-10'>
                {/* Text content for the hero section */}
                <div className='max-w-xl md:max-w-2xl mx-auto'>
                  <h1 className=' text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-display'> Shop smarter with Campex</h1>
                  <p className='mt-4 text-lg text-footer-foreground/80'>Discover a world of campus essentials at unbeatable prices. From textbooks to tech gadgets, find everything you need in one place.</p>
                </div>
              </div>

            {/* The search bar */}
            <div className='md:absolute md:inset-x-0 lg:bottom-0 flex items-center justify-center px-4'>
              <div className='w-full max-w-5xl mx-auto lg:translate-y-1/2'>
                  <SearchBar 
                    categories={categories} 
                    universities={universities}
                    onSearch={handleSearch}
                  />
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
              {featuredProducts && featuredProducts.length > 0 ? (
                featuredProducts.map((product: any) => (
                  <ProductCard
                    key={product.product_id}
                    id={product.product_id}
                    name={product.product_name}
                    storeName={product.store_name}
                    price={product.price}
                    imageUrl={product.product_image}
                    rating={product.total_reviews}
                    applyBadge={product.applybadge}
                    badgeText={product.badgetext}
                  />
                ))
              ) : (
                <p className='text-center text-white font-bold'>No featured products available.</p>
              )}
            </div>
          </div>
        </section>

        <section id="latest" className='relative mt-6 sm:mt-8 md:mt-10 lg:mt-12'>
          {/* Popular products section */}
          <HomeSectionProductView sectionTitle="New Listings" seeAllLink="products?sort=latest" productData={latestProducts} />
        </section>

        <section id="popular" className='relative mt-6 sm:mt-8 md:mt-10 lg:mt-12'>
          {/* Popular products section */}
          <HomeSectionProductView sectionTitle="Popular Items" seeAllLink="products?sort=popular" productData={popularProducts} />
        </section>

        <section id='for-you' className='relative mt-6 sm:mt-8 md:mt-10 lg:mt-12'>
          <HomeSectionProductView sectionTitle="For You" seeAllLink="products?sort=featured" productData={recommendedProducts} />
        </section>

        <section id='vendors' className='relative mt-6 sm:mt-8 md:mt-10 lg:mt-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4'>
            <div className='flex justify-between items-baseline mb-8'>
              <h2 className='text-2xl font-bold'>Top Vendors</h2>
              <Link to={"/marketplace/vendors"} >See All</Link>
            </div>
            {/* Popular products grid */}
            <div className='relative'>
              <div className='-mx-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]'>
                <div className='mx-4 flex gap-6 snap-x snap-mandatory no-scrollbar-new'>
                  {topVendors.map((vendor, index) => (
                    <div className='snap-start shrink-0 w-64' key={index}>
                        <VendorCard
                          key={vendor.id ?? ''}
                          id={vendor.id ?? ''}
                          name={vendor.name || 'Unnamed Vendor'}
                          whatsappNumber={vendor.whatsapp_number || ''}
                          tagline={vendor.tagline || 'Campus Vendor'}
                          university={vendor.university || 'Unknown'}
                          logoUrl={vendor.logoUrl ?? ''}
                          rating={vendor.rating ?? 0}
                          category={vendor.category || 'General'}
                          verified={vendor.verified ?? false}
                        />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default IndexPage;