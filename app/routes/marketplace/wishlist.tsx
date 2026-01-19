import type { Route } from './+types/wishlist';
import { getOptionalAuth } from '~/utils/optionalAuth.server';
import { data } from 'react-router';
import { Heart, Share2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';
import ProductCard from '~/components/marketplace/ProductCard';

export const meta = () => {
  return [
    { title: "My Wishlist | Campex" },
    { name: "description", content: "View and manage your saved products on Campex." },
  ];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { user, supabase, headers } = await getOptionalAuth(request);

  if (!user) {
    return data(
      { user: null, wishlistItems: [], recommendedProducts: [] },
      { headers }
    );
  }

  const [wishlistData, recommendedProducts ] = await Promise.all(
    [
      supabase
      .from('wishlists')
      .select(`
        created_at,
        store_listings (
          *,
          stores (
            business_name
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),

      supabase
    .from('store_listings')
    .select('*, stores(business_name)')
    .limit(4)
    .order('created_at', { ascending: false }),
    ]
  )

  // Debug
  console.log('Wishlist Data:', wishlistData);
  console.log('Recommended Products:', recommendedProducts);

  return data(
    {
      user,
      wishlistItems: wishlistData.data || [],
      recommendedProducts: recommendedProducts.data || [],
    },
    { headers }
  );
}

const WishlistPage = ({ loaderData }: Route.ComponentProps) => {
  const { wishlistItems, recommendedProducts } = loaderData;

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-foreground mb-2'>My Wishlist</h1>
          <p className='text-muted-foreground'>
            You have <span className='font-semibold text-foreground'>{wishlistItems.length}</span> items saved
          </p>
        </div>

        {wishlistItems.length > 0 ? (
          <>
            {/* Wishlist Items */}
            <div className='mb-16'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {wishlistItems.map((item) => (
                  <ProductCard key={item.store_listings.id}
                    id={  item.store_listings.id}
                    name={item.store_listings.title}
                    imageUrl={item.store_listings.image_url}
                    price={item.store_listings.price}
                    storeName={item.store_listings.stores.business_name}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className='bg-white dark:bg-slate-800 rounded-lg shadow-md p-12 text-center mb-16'>
            <Heart size={48} className='mx-auto text-muted-foreground mb-4' />
            <h2 className='text-2xl font-semibold text-foreground mb-2'>Your wishlist is empty</h2>
            <p className='text-muted-foreground mb-6'>
              Start adding products to your wishlist to save them for later
            </p>
            <Link
              to='/marketplace'
              className='inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium'
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {/* Recommended For You Section */}
        {recommendedProducts.length > 0 && (
          <div>
            <h2 className='text-3xl font-bold text-foreground mb-8'>Recommended For You</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} 
                    id={product.id}
                    name={product.title}
                    imageUrl={product.image_url}
                    price={product.price}
                    storeName={product.stores.business_name}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;