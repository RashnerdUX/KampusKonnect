import React, {useState, useEffect} from 'react'
import type { Route } from './+types/product.add';
import { Form, useRouteLoaderData } from 'react-router';
import { FaCloudArrowUp } from "react-icons/fa6";
import { createSupabaseServerClient } from '~/utils/supabase.server';
import type { User } from '@supabase/supabase-js';

export const meta = (_args: Route.MetaArgs) => {
  return [
    {title: "Add Product - Vendor Dashboard - Campex"},
    {name: "description", content: "Add a new product to your vendor store on Campex."},  
    {name: "keywords", content: "Campex, Vendor, Add Product"}
  ]
}

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData()

  const productTitle = formData.get('productTitle') as string
  const productDescription = formData.get('productDescription') as string
  const productPrice = formData.get('productPrice') as string
  const imageFile = formData.get('imageUpload')

  // Safe guards for form fields
  if (typeof productTitle !== 'string' || productTitle.length === 0) {
    return { error: 'Product title is required' }
  }
  if (typeof productDescription !== 'string' || productDescription.length === 0) {
    return { error: 'Product description is required' }
  }
  if (typeof productPrice !== 'string' || isNaN(parseFloat(productPrice))) {
    return { error: 'Valid product price is required' }
  }

  // Debug
  console.log("Received form data:", { productTitle, productDescription, productPrice, imageFile });

  // Type guard: ensure it's a File (not a string)
  if (!(imageFile instanceof File) || imageFile.size === 0) {
    console.error("No image uploaded")
    return { error: 'No image uploaded' }
  }

  // Create the client
  const { supabase, headers } = createSupabaseServerClient(request)

  // Get the current user's session
  const { data: { user }, error: sessionError } = await supabase.auth.getUser()
  if (sessionError || !user) {
    console.error("The user isn't authenticated")
    return { error: 'Not authenticated' }
  }

  // Get the user's store
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (storeError || !store) {
    console.error("Error fetching store: ", storeError)
    return { error: 'Store not found. Please create a store first.' }
  }

  // Build a unique path for the image
  const fileExt = imageFile.name.includes('.') ? imageFile.name.split('.').pop() : '.jpg'
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
  const imagePath = `products/${fileName}`

  // Upload image to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(imagePath, imageFile, {
      contentType: imageFile.type,
      upsert: false,
    })

  if (uploadError) {
    console.error("Error uploading image: ", uploadError)
    return { error: uploadError.message }
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(imagePath)

  const imageUrl = publicUrlData.publicUrl

  // Upload the product
  const { data: insertData, error: insertError } = await supabase.from('store_listings').insert([
    {
      store_id: store.id,
      title: productTitle,
      description: productDescription,
      price: parseFloat(productPrice),
      image_url: imageUrl,
    }
  ]).select()

  if (insertError) {
    console.error("Error uploading product: ", insertError)
    return { error: insertError.message }
  }

  return { success: true, imageUrl }
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    return null
}

export const AddProduct = ({loaderData}: Route.ComponentProps) => {

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productTitle, setProductTitle] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [productPrice, setProductPrice] = useState<number | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]

      // Check to make sure a url doesn't exist already
      if (imagePreview){
        URL.revokeObjectURL(imagePreview);
      }

      // Create a new review URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  useEffect(() => {
    return () => {
      // Remove the Url when unmounting
      if (imagePreview){
        URL.revokeObjectURL(imagePreview);
      }
    }
  }, [])

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-foreground text-2xl font-bold'>Add Product</h1>

      <main className='flex flex-col lg:flex-row gap-4 lg:gap-6'>
        {/* The form for submission */}
        <div className='bg-card w-[70%] h-full rounded-2xl p-4 flex flex-col gap-4'>
          <Form method="post" encType="multipart/form-data">
            
            {/* Image Upload */}
            <label
              htmlFor="imageUpload"
              className="w-full cursor-pointer border-2 border-border border-dashed rounded-2xl py-12 flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors"
            >
              <FaCloudArrowUp className="size-16 text-foreground" />
              <h3 className="text-foreground font-bold text-2xl">Upload Image</h3>
              <p className="text-base text-foreground/80 font-normal">
                Drag and drop an image here, or click to select one
              </p>
              <input
                id="imageUpload"
                name="imageUpload"
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                hidden
              />
            </label>

            {/* Text Inputs */}
            <div className='flex flex-col gap-4 mt-4'>
              <div className='flex flex-col gap-1'>
                <label htmlFor="productTitle" className='text-foreground font-medium'>Product Title</label>
                <input 
                  type="text" 
                  id="productTitle" 
                  name="productTitle" 
                  className='input-field bg-foreground/5'
                  placeholder='Enter the product title'
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  required
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor="productDescription" className='text-foreground font-medium'>Product Description</label>
                <input 
                  type="text" 
                  id="productDescription" 
                  name="productDescription" 
                  className='input-field bg-foreground/5'
                  placeholder='Enter the product description'
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  required
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor="productPrice" className='text-foreground font-medium'>Product Price</label>
                <input 
                  type="number" 
                  id="productPrice" 
                  name="productPrice" 
                  className='input-field bg-foreground/5'
                  placeholder='Enter the product price'
                  required
                  value={productPrice !== null ? productPrice : ''}
                  onChange={(e) => setProductPrice(e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2 justify-end mt-6'>
              <button type="button" className='py-2 px-4 rounded-full text-base text-foreground'>Save draft</button>
              <button type="submit" className='py-2 px-4 bg-primary text-primary-foreground rounded-full text-base'>Publish product</button>
            </div>
          </Form>
        </div>  

        {/* The Preview */}
        <div className="bg-card w-[30%] h-full p-4 rounded-2xl">
          <h2 className='text-foreground text-lg font-semibold mb-4'>Product Preview</h2>

          {/* Preview details */}
          <div className='flex flex-col items-start'>
            {imagePreview ? (
              <img src={imagePreview} alt="Product Preview" className='w-full h-60 rounded-lg' />
            ) : (
              <div className='w-full h-60 bg-muted flex items-center justify-center rounded-lg'>
                <span className='text-foreground/50'>Image Preview</span>
              </div>
            )}
            <h3 className='text-foreground font-bold text-xl mt-4'>{productTitle || "Product Name"}</h3>
            <p className='text-foreground/80 mt-2'>Description: {productDescription || "Example Description"}</p>
            <p className='text-foreground/80 mt-2'>Price: ₦{productPrice !== null ? productPrice.toFixed(2) : "0.00"}</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AddProduct;
