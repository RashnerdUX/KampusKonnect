import React, { useState, useEffect, useRef } from 'react'
import type { Route } from './+types/product.add'
import { Form, redirect, data, useNavigate, useSubmit, useNavigation } from 'react-router'
import { FaCloudArrowUp } from 'react-icons/fa6'
import { createSupabaseServerClient } from '~/utils/supabase.server'
import { compressImageFile } from '~/hooks/useImageCompression'
import ButtonSpinner from '~/components/ButtonSpinner'
import { RiAiGenerate2 } from "react-icons/ri";

export const meta = (_args: Route.MetaArgs) => {
  return [
    { title: 'Add Product - Vendor Dashboard - Campex' },
    { name: 'description', content: 'Add a new product to your vendor store on Campex.' },
    { name: 'keywords', content: 'Campex, Vendor, Add Product' },
  ]
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, headers } = createSupabaseServerClient(request)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login', { headers })
  }

  // Check if user has a store
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (storeError || !store) {
    return redirect('/onboarding/vendor/store', { headers })
  }

  // Fetch product categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError)
  }

  return data({ categories: categories ?? [] }, { headers })
}

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData()

  const productTitle = formData.get('productTitle') as string
  const productDescription = formData.get('productDescription') as string
  const productPrice = formData.get('productPrice') as string
  const productCategory = formData.get('productCategory') as string
  const stockQuantity = formData.get('stockQuantity') as string
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
  if (typeof productCategory !== 'string' || productCategory.length === 0) {
    return { error: 'Product category is required' }
  }
  if (typeof stockQuantity !== 'string' || isNaN(parseInt(stockQuantity, 10))) {
    return { error: 'Valid stock quantity is required' }
  }

  // Debug
  console.log('Received form data:', {
    productTitle,
    productDescription,
    productPrice,
    productCategory,
    stockQuantity,
    imageFile,
  })

  // Type guard: ensure it's a File (not a string)
  if (!(imageFile instanceof File) || imageFile.size === 0) {
    console.error('No image uploaded')
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
    .eq('user_id', user.id)
    .single()

  if (storeError || !store) {
    console.error('Error fetching store: ', storeError)
    return { error: 'Store not found. Please create a store first.' }
  }

  // Build a unique path for the image (user.id as first folder)
  const fileExt = imageFile.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
  const imagePath = `${user.id}/${fileName}`

  // Upload image to Supabase Storage
  console.log('Uploading image to storage at path: ', imagePath)
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(imagePath, imageFile, {
      contentType: imageFile.type,
      upsert: false,
    })

  if (uploadError) {
    console.error('Error uploading image: ', uploadError)
    return { error: uploadError.message }
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(imagePath)

  const imageUrl = publicUrlData.publicUrl

  // Upload the product
  console.log('Inserting product into database')
  const { data: insertData, error: insertError } = await supabase
    .from('store_listings')
    .insert([
      {
        store_id: store.id,
        title: productTitle,
        description: productDescription,
        price: parseFloat(productPrice),
        category_id: productCategory,
        stock_quantity: parseInt(stockQuantity, 10),
        image_url: imageUrl,
      },
    ])
    .select()

  if (insertError) {
    console.error('Error uploading product: ', insertError)
    return { error: insertError.message }
  }

  console.log('Product added successfully: ', insertData)
  return redirect('/vendor/products', { headers })
}

export const AddProduct = ({ loaderData }: Route.ComponentProps) => {
  const navigate = useNavigate()
  const navigation = useNavigation()
  const { categories } = loaderData ?? { categories: [] }

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [productTitle, setProductTitle] = useState<string>('')
  const [productDescription, setProductDescription] = useState<string>('')
  const [productPrice, setProductPrice] = useState<number | null>(null)
  const [productCategory, setProductCategory] = useState<string>('')
  const [stockQuantity, setStockQuantity] = useState<number | null>(null)
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // For AI generation
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState<boolean>(false)
  const [generatedDescription, setGeneratedDescription] = useState<string>("")

  if (navigation.state === 'submitting' && !isSubmitting) {
    setIsSubmitting(true)
  } else if (navigation.state === "idle" && isSubmitting ) {
    setIsSubmitting(false);
  }

  const blobUrlRef = useRef<string | null>(null)
  const submit = useSubmit()

  const generateProductDescriptionWithAI = async (imageFile: File) => {
    const url = "https://slijaoqgxaewlqthtahj.supabase.co/functions/v1/generate-product-descriptions";
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      setIsGeneratingWithAI(true);
      const response = await fetch(
        url,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: formData
        }
      );

      const data = await response.json();
      // A debug statement
      if (data.error){
        setGeneratedDescription(data.error);
      }
      setGeneratedDescription(data.description);
    } catch (error) {
      console.error("There was an error generating a description for this product")
    } finally {
      setIsGeneratingWithAI(false);
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setIsCompressing(true)

      // Revoke previous blob URL if exists
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
      }

      try {
        // Compress the image before storing
        const compressed = await compressImageFile(file, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.85,
        })
        setCompressedFile(compressed)

        // Create a preview URL from compressed file
        const previewUrl = URL.createObjectURL(compressed)
        blobUrlRef.current = previewUrl
        setImagePreview(previewUrl)

        console.log(`Compressed: ${file.name} (${(file.size / 1024).toFixed(1)}KB) → (${(compressed.size / 1024).toFixed(1)}KB)`)
      } catch (err) {
        console.error('Compression failed, using original:', err)
        // Fallback to original file
        setCompressedFile(file)
        const previewUrl = URL.createObjectURL(file)
        blobUrlRef.current = previewUrl
        setImagePreview(previewUrl)
      } finally {
        setIsCompressing(false)
      }
    }
  }

  useEffect(() => {
    return () => {
      // Remove the URL when unmounting
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    // Replace the original file with the compressed one
    if (compressedFile) {
      formData.set('imageUpload', compressedFile)
    }

    submit(formData, { method: 'post', encType: 'multipart/form-data' })
  }

  // Get selected category name for preview
  const selectedCategoryName = categories.find((c) => c.id === productCategory)?.name ?? ''

  return (
    <div className="flex flex-col gap-4">
      <div className='flex items-center gap-4'>
        <button
            onClick={() => navigate('/vendor/products')}
            className="rounded-full p-2 text-foreground/60 transition hover:bg-muted hover:text-foreground"
            aria-label="Go back to products"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-foreground">Add Product</h1>
      </div>

      <main className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* The form for submission */}
        <div className="flex h-full w-full flex-col gap-4 rounded-2xl bg-card p-4 lg:w-[70%]">
          <Form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
            {/* Image Upload */}
            <label
              htmlFor="imageUpload"
              className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-12 transition-colors hover:border-primary"
            >
              {isCompressing ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-sm text-foreground/70">Uploading image...</p>
                </div>
              ) : imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  className="h-48 w-48 rounded-lg object-cover"
                />
              ) : (
                <>
                  <FaCloudArrowUp className="size-16 text-foreground" />
                  <h3 className="text-2xl font-bold text-foreground">Upload Image</h3>
                  <p className="text-base font-normal text-foreground/80">
                    Drag and drop an image here, or click to select one
                  </p>
                </>
              )}
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
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="productTitle" className="font-medium text-foreground">
                  Product Title
                </label>
                <input
                  type="text"
                  id="productTitle"
                  name="productTitle"
                  className="input-field bg-foreground/5"
                  placeholder="Enter the product title"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className='flex justify-between items-center'>
                  <label htmlFor="productDescription" className="font-medium text-foreground">
                  Product Description
                  </label>
                  <button 
                    type="button" 
                    onClick={() => {
                      console.log("Generate with AI button clicked!");
                      if(compressedFile) {
                        console.log("Generating AI description")
                        generateProductDescriptionWithAI(compressedFile)
                      };
                    }}
                    className='flex gap-1 items-center border border-foreground py-0.5 px-3 rounded-2xl hover:bg-foreground/10 focus:bg-foreground/10'
                  >
                    {isGeneratingWithAI ? <ButtonSpinner /> : <RiAiGenerate2  size={22} className='text-foreground'/>}
                    <span className='hidden md:block'>{isGeneratingWithAI ? "Generating...":"Generate with AI"}</span>
                  </button>
                </div>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  className="input-field min-h-[100px] bg-foreground/5"
                  placeholder={isGeneratingWithAI ? "Thinking..." : "Enter the product description"}
                  value={
                    generatedDescription.length>0 ? generatedDescription : productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="productCategory" className="font-medium text-foreground">
                  Category
                </label>
                <select
                  id="productCategory"
                  name="productCategory"
                  className="input-field bg-foreground/5"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="productPrice" className="font-medium text-foreground">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    id="productPrice"
                    name="productPrice"
                    className="input-field bg-foreground/5"
                    placeholder="Enter the product price"
                    min="0"
                    step="0.01"
                    required
                    value={productPrice !== null ? productPrice : ''}
                    onChange={(e) =>
                      setProductPrice(e.target.value ? parseFloat(e.target.value) : null)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="stockQuantity" className="font-medium text-foreground">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    className="input-field bg-foreground/5"
                    placeholder="Enter stock quantity"
                    min="0"
                    step="1"
                    required
                    value={stockQuantity !== null ? stockQuantity : ''}
                    onChange={(e) =>
                      setStockQuantity(e.target.value ? parseInt(e.target.value, 10) : null)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="hidden rounded-full px-4 py-2 text-base text-foreground hover:bg-muted"
              >
                Save draft
              </button>
              <button
                type="submit"
                className={ `rounded-full bg-primary px-6 py-2 text-base font-medium text-primary-foreground hover:bg-primary/90 flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}` }
                disabled={isSubmitting}
              >
                {isSubmitting && <ButtonSpinner />}
                {isSubmitting ? 'Publishing...' : 'Publish product'}
              </button>
            </div>
          </Form>
        </div>

        {/* The Preview */}
        <div className="h-full w-full rounded-2xl bg-card p-4 lg:w-[30%]">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Product Preview</h2>

          {/* Preview details */}
          <div className="flex flex-col items-start">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Product Preview"
                className="h-60 w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-60 w-full items-center justify-center rounded-lg bg-muted">
                <span className="text-foreground/50">Image Preview</span>
              </div>
            )}
            <h3 className="mt-4 text-xl font-bold text-foreground">
              {productTitle || 'Product Name'}
            </h3>
            {selectedCategoryName && (
              <span className="mt-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {selectedCategoryName}
              </span>
            )}
            <p className="mt-2 text-foreground/80">
              {productDescription || 'Product description will appear here...'}
            </p>
            <div className="mt-4 flex w-full items-center justify-between">
              <p className="text-lg font-bold text-foreground">
                ₦{productPrice !== null ? productPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 }) : '0.00'}
              </p>
              <p className="text-sm text-foreground/60">
                Stock: {stockQuantity !== null ? stockQuantity : 0}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AddProduct
