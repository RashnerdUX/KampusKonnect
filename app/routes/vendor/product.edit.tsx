import React, { useState, useEffect, useRef } from 'react'
import type { Route } from './+types/product.edit'
import { Form, redirect, data, useNavigate, useSubmit } from 'react-router'
import { FaCloudArrowUp } from 'react-icons/fa6'
import { createSupabaseServerClient } from '~/utils/supabase.server'
import { compressImageFile } from '~/hooks/useImageCompression'

export const meta = ({ data }: Route.MetaArgs) => {
  const productName = data?.product?.title ?? 'Edit Product'
  return [
    { title: `${productName} - Edit - Campex` },
    { name: 'description', content: `Edit ${productName} on your vendor store.` },
    { name: 'keywords', content: 'Campex, Vendor, Edit Product' },
  ]
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { supabase, headers } = createSupabaseServerClient(request)
  const { productId } = params

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

  // Fetch the product
  const { data: product, error: productError } = await supabase
    .from('store_listings')
    .select(`
      id,
      title,
      description,
      price,
      image_url,
      is_active,
      category_id,
      stock_quantity
    `)
    .eq('id', productId)
    .eq('store_id', store.id)
    .single()

  if (productError || !product) {
    console.error('Error fetching product:', productError)
    return redirect('/vendor/products', { headers })
  }

  // Fetch product categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError)
  }

  return data({ product, categories: categories ?? [], storeId: store.id }, { headers })
}

export const action = async ({ request, params }: Route.ActionArgs) => {
  const formData = await request.formData()
  const { productId } = params

  const productTitle = formData.get('productTitle') as string
  const productDescription = formData.get('productDescription') as string
  const productPrice = formData.get('productPrice') as string
  const productCategory = formData.get('productCategory') as string
  const stockQuantity = formData.get('stockQuantity') as string
  const isActive = formData.get('isActive') === 'true'
  const imageFile = formData.get('imageUpload')
  const existingImageUrl = formData.get('existingImageUrl') as string

  // Validations
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

  const { supabase, headers } = createSupabaseServerClient(request)

  const { data: { user }, error: sessionError } = await supabase.auth.getUser()
  if (sessionError || !user) {
    return { error: 'Not authenticated' }
  }

  // Get the user's store
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (storeError || !store) {
    return { error: 'Store not found.' }
  }

  // Verify the product belongs to this store
  const { data: existingProduct, error: existingError } = await supabase
    .from('store_listings')
    .select('id, image_url')
    .eq('id', productId)
    .eq('store_id', store.id)
    .single()

  if (existingError || !existingProduct) {
    return { error: 'Product not found or you do not have permission to edit it.' }
  }

  let imageUrl = existingImageUrl

  // Check if a new image was uploaded
  if (imageFile instanceof File && imageFile.size > 0) {
    // Delete old image if it exists
    if (existingProduct.image_url) {
      const oldPath = existingProduct.image_url.split('/product-images/')[1]
      if (oldPath) {
        await supabase.storage.from('product-images').remove([oldPath])
      }
    }

    // Upload new image
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    const imagePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(imagePath, imageFile, {
        contentType: imageFile.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      return { error: uploadError.message }
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath)

    imageUrl = publicUrlData.publicUrl
  }

  // Update the product
  const { error: updateError } = await supabase
    .from('store_listings')
    .update({
      title: productTitle,
      description: productDescription,
      price: parseFloat(productPrice),
      category_id: productCategory,
      stock_quantity: parseInt(stockQuantity, 10),
      image_url: imageUrl,
      is_active: isActive,
    })
    .eq('id', productId)
    .eq('store_id', store.id)

  if (updateError) {
    console.error('Error updating product:', updateError)
    return { error: updateError.message }
  }

  return redirect('/vendor/products', { headers })
}

export const EditProduct = ({ loaderData, actionData }: Route.ComponentProps) => {
  const { product, categories } = loaderData ?? { product: null, categories: [] }
  const navigate = useNavigate()

  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url ?? null)
  const [hasNewImage, setHasNewImage] = useState(false)
  const [productTitle, setProductTitle] = useState<string>(product?.title ?? '')
  const [productDescription, setProductDescription] = useState<string>(product?.description ?? '')
  const [productPrice, setProductPrice] = useState<number | null>(product?.price ?? null)
  const [productCategory, setProductCategory] = useState<string>(product?.category_id ?? '')
  const [stockQuantity, setStockQuantity] = useState<number | null>(product?.stock_quantity ?? null)
  const [isActive, setIsActive] = useState<boolean>(product?.is_active ?? true)
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const blobUrlRef = useRef<string | null>(null)
  const submit = useSubmit()

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
        setHasNewImage(true)

        console.log(`Compressed: ${file.name} (${(file.size / 1024).toFixed(1)}KB) → (${(compressed.size / 1024).toFixed(1)}KB)`)
      } catch (err) {
        console.error('Compression failed, using original:', err)
        // Fallback to original file
        setCompressedFile(file)
        const previewUrl = URL.createObjectURL(file)
        blobUrlRef.current = previewUrl
        setImagePreview(previewUrl)
        setHasNewImage(true)
      } finally {
        setIsCompressing(false)
      }
    }
  }

  useEffect(() => {
    return () => {
      // Remove the blob URL when unmounting
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    // Replace the original file with the compressed one if available
    if (compressedFile) {
      formData.set('imageUpload', compressedFile)
    }

    submit(formData, { method: 'post', encType: 'multipart/form-data' })
  }

  // Get selected category name for preview
  const selectedCategoryName = categories.find((c) => c.id === productCategory)?.name ?? ''

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-foreground/60">Product not found.</p>
        <button
          onClick={() => navigate('/vendor/products')}
          className="rounded-full bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/vendor/products')}
          className="rounded-full p-2 text-foreground/60 transition hover:bg-muted hover:text-foreground"
          aria-label="Go back to products"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
      </div>

      {actionData?.error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {actionData.error}
        </div>
      )}

      <main className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* The form for submission */}
        <div className="flex h-full w-full flex-col gap-4 rounded-2xl bg-card p-4 lg:w-[70%]">
          <Form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
            {/* Hidden field to preserve existing image URL */}
            <input type="hidden" name="existingImageUrl" value={product.image_url ?? ''} />
            <input type="hidden" name="isActive" value={isActive.toString()} />

            {/* Image Upload */}
            <label
              htmlFor="imageUpload"
              className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-12 transition-colors hover:border-primary"
            >
              {isCompressing ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-sm text-foreground/70">Uploading image</p>
                </div>
              ) : imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    className="h-48 w-48 rounded-lg object-cover"
                  />
                  <span className="mt-2 block text-center text-sm text-foreground/60">
                    Click to change image
                  </span>
                </div>
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
                <label htmlFor="productDescription" className="font-medium text-foreground">
                  Product Description
                </label>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  className="input-field min-h-[100px] bg-foreground/5"
                  placeholder="Enter the product description"
                  value={productDescription}
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
                  className="input-field bg-background/80"
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

              {/* Status Toggle */}
              <div className="flex items-center gap-3">
                <label className="font-medium text-foreground">Product Status</label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-sm ${isActive ? 'text-green-600 dark:text-green-400' : 'text-foreground/60'}`}>
                  {isActive ? 'Active (In Stock)' : 'Inactive (Out of Stock)'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate('/vendor/products')}
                className="rounded-full px-4 py-2 text-base text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-primary px-4 py-2 text-base text-primary-foreground hover:bg-primary/90"
              >
                Save Changes
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
            <div className="mt-1 flex items-center gap-2">
              {selectedCategoryName && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {selectedCategoryName}
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  isActive
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
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

export default EditProduct
