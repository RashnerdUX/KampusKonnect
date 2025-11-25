import type { ProductCardProps } from '~/components/marketplace/ProductCard';
import type { VendorCardProps } from '~/components/marketplace/VendorCard';
import type { Database } from "./database.types"

type storeListing = Database['public']['Tables']['store_listings']['Row'];

export const storeListings: storeListing[] = [
  {
    id: '1',
    store_id: 'vendor_1',
    title: 'Sample Product',
    description: 'This is a sample product description.',
    price: 1999,
    image_url: 'https://example.com/sample-product.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true
  }
]

export const stockVendors: VendorCardProps[] = [
  {
    id: 'techstore',
    name: 'TechStore',
    tagline: 'Cutting-edge gadgets and accessories',
    rating: 4.8,
    reviewCount: 1320,
    location: 'San Francisco, CA',
    category: 'Electronics',
    logoUrl: 'https://example.com/vendors/techstore-logo.png',
    coverUrl: 'https://example.com/vendors/techstore-cover.jpg',
    verified: true,
  },
  {
    id: 'healthylife',
    name: 'HealthyLife Market',
    tagline: 'Clean ingredients for a balanced lifestyle',
    rating: 4.6,
    reviewCount: 980,
    location: 'Austin, TX',
    category: 'Groceries',
    logoUrl: 'https://example.com/vendors/healthylife-logo.png',
    coverUrl: 'https://example.com/vendors/healthylife-cover.jpg',
    verified: false,
  },
  {
    id: 'bookworld',
    name: 'BookWorld',
    tagline: 'Stories, knowledge, and inspiration',
    rating: 4.9,
    reviewCount: 2140,
    location: 'Portland, OR',
    category: 'Books',
    logoUrl: 'https://example.com/vendors/bookworld-logo.png',
    coverUrl: 'https://example.com/vendors/bookworld-cover.jpg',
    verified: true,
  },
  {
    id: 'fitgear',
    name: 'FitGear',
    tagline: 'Performance wearables and fitness tech',
    rating: 4.7,
    reviewCount: 1665,
    location: 'Denver, CO',
    category: 'Fitness',
    logoUrl: 'https://example.com/vendors/fitgear-logo.png',
    coverUrl: 'https://example.com/vendors/fitgear-cover.jpg',
    verified: true,
  },
  {
    id: 'artisanbites',
    name: 'Artisan Bites',
    tagline: 'Small batch snacks crafted with care',
    rating: 4.5,
    reviewCount: 740,
    location: 'Brooklyn, NY',
    category: 'Snacks',
    logoUrl: 'https://example.com/vendors/artisanbites-logo.png',
    coverUrl: 'https://example.com/vendors/artisanbites-cover.jpg',
    verified: false,
  },
  {
    id: 'greenearth',
    name: 'GreenEarth Goods',
    tagline: 'Eco-conscious products for sustainable living',
    rating: 4.4,
    reviewCount: 520,
    location: 'Seattle, WA',
    category: 'Home',
    logoUrl: 'https://example.com/vendors/greenearth-logo.png',
    coverUrl: 'https://example.com/vendors/greenearth-cover.jpg',
    verified: false,
  },
  {
    id: 'bytebrew',
    name: 'ByteBrew Coffee',
    tagline: 'Tech-inspired specialty coffee blends',
    rating: 4.9,
    reviewCount: 1885,
    location: 'Boston, MA',
    category: 'Coffee',
    logoUrl: 'https://example.com/vendors/bytebrew-logo.png',
    coverUrl: 'https://example.com/vendors/bytebrew-cover.jpg',
    verified: true,
  },
  {
    id: 'urbanthreads',
    name: 'Urban Threads',
    tagline: 'Streetwear staples with a modern edge',
    rating: 4.3,
    reviewCount: 610,
    location: 'Los Angeles, CA',
    category: 'Fashion',
    logoUrl: 'https://example.com/vendors/urbanthreads-logo.png',
    coverUrl: 'https://example.com/vendors/urbanthreads-cover.jpg',
    verified: false,
  },
];

export const stockProducts: ProductCardProps[] = [
    {
      name: 'Wireless Headphones',
      storeName: 'TechStore',
      price: 59.99,
    },
    {
      name: 'Organic Green Tea',
      storeName: 'HealthyLife',
      price: 12.49,
    },
    {
      name: 'Classic Novel Set',
      storeName: 'BookWorld',
      price: 29.99,
    },
    {
      name: 'Fitness Tracker',
      storeName: 'FitGear',
      price: 79.99,
    },
    {
      name: 'Wireless Headphones',
      storeName: 'TechStore',
      price: 59.99,
    },
    {
      name: 'Organic Green Tea',
      storeName: 'HealthyLife',
      price: 12.49,
    },
    {
      name: 'Classic Novel Set',
      storeName: 'BookWorld',
      price: 29.99,
    },
    {
      name: 'Fitness Tracker',
      storeName: 'FitGear',
      price: 79.99,
    },
    {
      name: 'Wireless Headphones',
      storeName: 'TechStore',
      price: 59.99,
    },
    {
      name: 'Organic Green Tea',
      storeName: 'HealthyLife',
      price: 12.49,
    },
    {
      name: 'Classic Novel Set',
      storeName: 'BookWorld',
      price: 29.99,
    },
    {
      name: 'Fitness Tracker',
      storeName: 'FitGear',
      price: 79.99,
    },
  ]

export const featuredProducts: ProductCardProps[] = [
    {
      name: 'Wireless Headphones',
      storeName: 'TechStore',
      price: 59.99,
    },
    {
      name: 'Organic Green Tea',
      storeName: 'HealthyLife',
      price: 12.49,
    },
    {
      name: 'Classic Novel Set',
      storeName: 'BookWorld',
      price: 29.99,
    },
    {
      name: 'Fitness Tracker',
      storeName: 'FitGear',
      price: 79.99,
    }
  ]