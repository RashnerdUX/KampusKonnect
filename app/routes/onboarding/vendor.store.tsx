import React, { useState, useRef, useEffect} from 'react'
import type { Route } from './+types/vendor.store';
import { Form, Link, data, redirect, useSubmit, useNavigation } from 'react-router'
import { FaArrowLeft, FaArrowRight, FaCamera, FaCloudUploadAlt } from 'react-icons/fa'
import { requireAuth } from '~/utils/requireAuth.server'
import { createSupabaseServerClient } from '~/utils/supabase.server'
import { compressImageFile } from '~/hooks/useImageCompression'
import ButtonSpinner from '~/components/ButtonSpinner';

export const meta = (_args: Route.MetaArgs) => {
  return [
    { title: 'Create Your Store - Campex' },
    { name: 'description', content: 'Set up your store on Campex.' },
  ]
}

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase, headers } = createSupabaseServerClient(request)
  const { user } = await requireAuth(request)

  // Verify user has vendor role before submitting
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'vendor') {
    return redirect('/onboarding/role', { headers })
  }

  // Get form data
  const formData = await request.formData()

  const headerImage = formData.get('headerImage') as File
  const logoImage = formData.get('logoImage') as File
  const businessName = formData.get('businessName') as string
  const storeCategory = formData.get('storeCategory') as string
  const storeDescription = formData.get('storeDescription') as string

  // Validate required fields
  if (!logoImage || logoImage.size === 0) {
    return { error: 'Logo image is required' }
  }
  if (!businessName || !storeCategory || !storeDescription) {
    return { error: 'All fields are required' }
  }

  // Create unique file paths
  const logoImagePath = `${user.id}/logo-${Date.now()}`
  let headerUrl: string | null = null
  let logoUrl: string | null = null

  // Upload header image if provided
  if (headerImage && headerImage.size > 0) {
    const headerImagePath = `${user.id}/header-${Date.now()}`
    const { data: headerData, error: headerError } = await supabase.storage
      .from('store_header_images')
      .upload(headerImagePath, headerImage)

    if (headerError) {
      console.error('Error uploading header image:', headerError)
      return { error: 'Failed to upload header image' }
    }

    // Get public URL
    const { data: headerPublicUrl } = supabase.storage
      .from('store_header_images')
      .getPublicUrl(headerData.path)
    
    headerUrl = headerPublicUrl.publicUrl
  }

  // Upload logo image
  const { data: logoData, error: logoError } = await supabase.storage
    .from('store_logos')
    .upload(logoImagePath, logoImage)

  if (logoError) {
    console.error('Error uploading logo image:', logoError)
    return { error: 'Failed to upload logo image' }
  }

  // Get public URL for logo
  const { data: logoPublicUrl } = supabase.storage
    .from('store_logos')
    .getPublicUrl(logoData.path)

  logoUrl = logoPublicUrl.publicUrl

  // Create the store
  console.log("Creating a store for the user", user.id)
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .insert({
      user_id: user.id,
      business_name: businessName,
      category_id: storeCategory,
      description: storeDescription,
      logo_url: logoUrl,
      header_url: headerUrl,
    })
    .select()
    .single()

  if (storeError) {
    console.error('Error creating store:', storeError)
    return { error: 'Failed to create store' }
  }

  console.log("Store created for the user", user.id)
  return redirect('/onboarding/complete', { headers })
}

export const loader = async ({request}: Route.LoaderArgs) => {

    const {supabase, headers} = createSupabaseServerClient(request);

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        return redirect('/login', { headers })
    }

    // Check if user has vendor role
    const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        console.error('Error fetching profile:', profileError)
        return redirect('/onboarding/role', { headers })
    }

    // Redirect non-vendors to appropriate path
    if (profile.role !== 'vendor') {
        if (profile.role === 'student') {
        return redirect('/onboarding/student/profile', { headers })
        }
        return redirect('/onboarding/role', { headers })
    }

    // Check if user has already created a store
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (storeData) {
      // Take user to vendor dashboard if store exists
        return redirect('/vendor', { headers })
    }
    
    // Get store categories
    const { data: store_categories, error } = await supabase
    .from('store_categories')
    .select('id, name')

    if (error) {
        console.error("Error fetching store categories:", error);
    }
    
    return data({ store_categories: store_categories ?? [] }, { headers });
}

export default function VendorStore({loaderData, actionData}: Route.ComponentProps) {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (navigation.state === 'submitting' && !isSubmitting) {
    setIsSubmitting(true);
  } else if (navigation.state === "idle" && isSubmitting) {
    setIsSubmitting(false);
  }

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [headerPreview, setHeaderPreview] = useState<string | null>(null)
  const [compressedLogo, setCompressedLogo] = useState<File | null>(null)
  const [compressedHeader, setCompressedHeader] = useState<File | null>(null)
  const [isCompressingLogo, setIsCompressingLogo] = useState(false)
  const [isCompressingHeader, setIsCompressingHeader] = useState(false)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const headerInputRef = useRef<HTMLInputElement>(null)
  const logoBlobRef = useRef<string | null>(null)
  const headerBlobRef = useRef<string | null>(null)
  const submit = useSubmit()

//   The store categories
    const {store_categories} = loaderData;
    const {error} = actionData || {};

    // Clear the blobs after unmount
    useEffect(() => {
        return () => {
            if (logoBlobRef.current) {
            URL.revokeObjectURL(logoBlobRef.current)
            }
            if (headerBlobRef.current) {
            URL.revokeObjectURL(headerBlobRef.current)
            }
        }
    }, [])

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsCompressingLogo(true)
      if (logoBlobRef.current) URL.revokeObjectURL(logoBlobRef.current)

      try {
        const compressed = await compressImageFile(file, {
          maxWidth: 400,
          maxHeight: 400,
          quality: 0.85,
        })
        setCompressedLogo(compressed)
        const url = URL.createObjectURL(compressed)
        logoBlobRef.current = url
        setLogoPreview(url)
        console.log(`Logo compressed: ${file.name} (${(file.size / 1024).toFixed(1)}KB) → (${(compressed.size / 1024).toFixed(1)}KB)`)
      } catch (err) {
        console.error('Logo compression failed:', err)
        const url = URL.createObjectURL(file)
        logoBlobRef.current = url
        setLogoPreview(url)
      } finally {
        setIsCompressingLogo(false)
      }
    }
  }

  const handleHeaderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsCompressingHeader(true)
      if (headerBlobRef.current) URL.revokeObjectURL(headerBlobRef.current)

      try {
        const compressed = await compressImageFile(file, {
          maxWidth: 1200,
          maxHeight: 400,
          quality: 0.85,
        })
        setCompressedHeader(compressed)
        const url = URL.createObjectURL(compressed)
        headerBlobRef.current = url
        setHeaderPreview(url)
        console.log(`Header compressed: ${file.name} (${(file.size / 1024).toFixed(1)}KB) → (${(compressed.size / 1024).toFixed(1)}KB)`)
      } catch (err) {
        console.error('Header compression failed:', err)
        const url = URL.createObjectURL(file)
        headerBlobRef.current = url
        setHeaderPreview(url)
      } finally {
        setIsCompressingHeader(false)
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    // Replace with compressed files if available
    if (compressedLogo) {
      formData.set('logoImage', compressedLogo)
    }
    if (compressedHeader) {
      formData.set('headerImage', compressedHeader)
    }

    submit(formData, { method: 'post', encType: 'multipart/form-data' })
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Create Your Store</h1>
          <p className="text-foreground/70">Set up your storefront to start selling</p>
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>

        {/* Form */}
        <Form method="post" encType="multipart/form-data" className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Store Branding Section */}
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Store Branding</h2>

            {/* Header Image */}
            <div className="mb-4">
              <p className="mb-2 text-sm text-foreground/70">
                Header Image <span className="text-foreground/50">(Optional)</span>
              </p>
              <button
                type="button"
                onClick={() => headerInputRef.current?.click()}
                className="relative w-full overflow-hidden rounded-xl border-2 border-dashed border-border bg-background transition hover:border-primary"
              >
                {isCompressingHeader ? (
                  <div className="flex aspect-[3/1] flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <span className="text-sm text-foreground/70">Uploading image...</span>
                  </div>
                ) : headerPreview ? (
                  <div className="aspect-[3/1]">
                    <img src={headerPreview} alt="Header preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100">
                      <span className="flex items-center gap-2 text-sm font-medium text-white">
                        <FaCamera /> Change Image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex aspect-[3/1] flex-col items-center justify-center gap-2 text-foreground/50">
                    <FaCloudUploadAlt className="h-8 w-8" />
                    <span className="text-sm font-medium">Click to upload header image</span>
                    <span className="text-xs">Recommended: 1200 x 400px</span>
                  </div>
                )}
              </button>
              <input
                ref={headerInputRef}
                type="file"
                name="headerImage"
                accept="image/*"
                onChange={handleHeaderChange}
                className="hidden"
              />
            </div>

            {/* Logo */}
            <div>
              <p className="mb-2 text-sm text-foreground/70">
                Store Logo <span className="text-red-500">*</span>
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-background transition hover:border-primary"
                >
                  {isCompressingLogo ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      <span className="text-xs text-foreground/70">...</span>
                    </div>
                  ) : logoPreview ? (
                    <>
                      <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100">
                        <FaCamera className="text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-foreground/50">
                      <FaCloudUploadAlt className="h-6 w-6" />
                      <span className="text-xs">Upload</span>
                    </div>
                  )}
                </button>
                <div className="text-sm text-foreground/60">
                  <p>Your store logo will appear across the platform.</p>
                  <p className="text-xs">Recommended: 400 x 400px, square format</p>
                </div>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                name="logoImage"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
                required
              />
            </div>
          </div>

          {/* Store Details */}
          <div className="flex flex-col gap-4">
            {/* Business Name */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Business Name <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="businessName"
                placeholder="e.g. TechStore, FoodieHub"
                required
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            {/* Store Category */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Store Category <span className="text-red-500">*</span>
              </span>
              <select
                name="storeCategory"
                required
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a category</option>
                {store_categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Description */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Store Description <span className="text-red-500">*</span>
              </span>
              <textarea
                name="storeDescription"
                rows={4}
                placeholder="Tell customers what your store is about..."
                required
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-xs text-foreground/60">
                A good description helps customers find and trust your store
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Link
              to="/onboarding/vendor/profile"
              className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 font-medium text-foreground transition hover:bg-muted"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <button
              type="submit"
              className={`flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting && <ButtonSpinner />}
              {isSubmitting ? 'Creating...' : 'Create Store'}
              <FaArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}
