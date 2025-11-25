import React from 'react'
import type { Route } from './+types/$productId'
import type { Database } from '~/utils/database.types'
import { Loader } from 'lucide-react';

type StoreListing = Database['public']['Tables']['store_listings']['Row'];

export const meta = (_args: Route.MetaArgs) => {
  return [
    { title: "Discover and purchase products from your favorite vendors on your Campus with Campex" },
    { name: "description", content: ""},
    { name: "keywords", content: ""}
  ]
}

export async function loader({params}: Route.LoaderArgs) {

    const productId = params.productId;

    // Run and search for the product in the database using the productId
    // For now, we will return a sample object that reflects the Database
    const sampleProduct: StoreListing = {
        id: productId || '1',
        store_id: 'vendor_1',
        title: 'Sample Product',
        description: 'This is a sample product description.',
        price: 1999,
        image_url: 'https://example.com/sample-product.jpg',
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
    
  return (
    <div>ProductPage</div>
  )
}

export default ProductPage