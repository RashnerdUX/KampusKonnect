import React, { useState, useRef, useEffect } from 'react'
import type { Route } from './+types/profile'
import { Form, Link, redirect, data } from 'react-router'
import { FaExternalLinkAlt, FaStar, FaPen, FaTimes, FaCamera, FaUser } from 'react-icons/fa'

import VerifiedBadge from '~/components/dashboard/VerifiedBadge'
import ProfileSection from '~/components/dashboard/ProfileSection'
import { createSupabaseServerClient } from '~/utils/supabase.server'

export const meta = () => {
  return [
    { title: 'Store Profile - Campex' },
    { name: 'description', content: 'Manage your store profile on Campex' },
  ]
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, headers } = createSupabaseServerClient(request)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login', { headers })
  }

  // Fetch user's store with category
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select(`
      id,
      business_name,
      description,
      logo_url,
      header_url,
      verified_badge,
      category:store_categories(id, name)
    `)
    .eq('user_id', user.id)
    .single()

  if (storeError || !store) {
    console.error('Error fetching store:', storeError)
    return redirect('/onboarding/vendor/store', { headers })
  }

  // Fetch reviews for this store
  // Reviews where listing_id = store.id and listing_type = 'store'
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      user:user_profiles(id, first_name, surname, avatar_url)
    `)
    .eq('listing_id', store.id)
    .eq('listing_type', 'store')
    .order('created_at', { ascending: false })
    .limit(5)

  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError)
  }

  // Calculate average rating and total count
  const { data: ratingData, error: ratingError } = await supabase
    .from('reviews')
    .select('rating')
    .eq('listing_id', store.id)
    .eq('listing_type', 'store')

  let averageRating = 0
  let reviewCount = 0

  if (!ratingError && ratingData) {
    reviewCount = ratingData.length
    if (reviewCount > 0) {
      const totalRating = ratingData.reduce((sum, r) => sum + (r.rating ?? 0), 0)
      averageRating = Math.round((totalRating / reviewCount) * 10) / 10
    }
  }

  // Fetch store categories for the edit dropdown
  const { data: categories } = await supabase
    .from('store_categories')
    .select('id, name')
    .order('name')

  return data(
    {
      store: {
        id: store.id,
        name: store.business_name,
        description: store.description ?? '',
        category: store.category?.name ?? 'Uncategorized',
        categoryId: store.category?.id ?? '',
        logoUrl: store.logo_url ?? '',
        headerUrl: store.header_url ?? '',
        verified: store.verified_badge ?? false,
        rating: averageRating,
        reviewCount,
      },
      reviews: (reviews ?? []).map((r) => ({
        id: r.id,
        author: r.user ? `${r.user.first_name ?? ''} ${r.user.surname ?? ''}`.trim() || 'Anonymous' : 'Anonymous',
        avatar: r.user?.avatar_url ?? '',
        rating: r.rating ?? 0,
        date: formatRelativeDate(r.created_at),
        comment: r.comment ?? '',
      })),
      categories: categories ?? [],
    },
    { headers }
  )
}

// Helper function to format relative dates
function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return '1 week ago'
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 60) return '1 month ago'
  return `${Math.floor(diffDays / 30)} months ago`
}

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase, headers } = createSupabaseServerClient(request)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login', { headers })
  }

  const formData = await request.formData()
  const intent = formData.get('intent') as string

  // Get user's store
  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!store) {
    return { error: 'Store not found' }
  }

  if (intent === 'updateAbout') {
    const storeName = formData.get('storeName') as string
    const storeCategory = formData.get('storeCategory') as string
    const storeDescription = formData.get('storeDescription') as string

    if (!storeName || !storeCategory) {
      return { error: 'Name and category are required' }
    }

    const { error } = await supabase
      .from('stores')
      .update({
        business_name: storeName,
        category_id: storeCategory,
        description: storeDescription,
      })
      .eq('id', store.id)

    if (error) {
      console.error('Error updating store:', error)
      return data({ error: 'Failed to update store information' }, { headers })
    }

    return { success: true }
  }

  if (intent === 'updateHeader') {
    const headerFile = formData.get('headerImage') as File

    if (!(headerFile instanceof File) || headerFile.size === 0) {
      return { error: 'No header image provided' }
    }

    // Upload to storage
    const fileExt = headerFile.name.split('.').pop()
    const filePath = `${user.id}/header-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('store_header_images')
      .upload(filePath, headerFile, { contentType: headerFile.type, upsert: true })

    if (uploadError) {
      console.error('Error uploading header:', uploadError)
      return { error: 'Failed to upload header image' }
    }

    const { data: publicUrl } = supabase.storage.from('store_header_images').getPublicUrl(filePath)

    const { error: updateError } = await supabase
      .from('stores')
      .update({ header_url: publicUrl.publicUrl })
      .eq('id', store.id)

    if (updateError) {
      console.error('Error updating header URL:', updateError)
      return { error: 'Failed to update header' }
    }

    return { success: true }
  }

  if (intent === 'updateLogo') {
    const logoFile = formData.get('logoImage') as File

    if (!(logoFile instanceof File) || logoFile.size === 0) {
      return { error: 'No logo image provided' }
    }

    // Upload to storage
    const fileExt = logoFile.name.split('.').pop()
    const filePath = `${user.id}/logo-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('store_logos')
      .upload(filePath, logoFile, { contentType: logoFile.type, upsert: true })

    if (uploadError) {
      console.error('Error uploading logo:', uploadError)
      return { error: 'Failed to upload logo image' }
    }

    const { data: publicUrl } = supabase.storage.from('store_logos').getPublicUrl(filePath)

    const { error: updateError } = await supabase
      .from('stores')
      .update({ logo_url: publicUrl.publicUrl })
      .eq('id', store.id)

    if (updateError) {
      console.error('Error updating logo URL:', updateError)
      return { error: 'Failed to update logo' }
    }

    return { success: true }
  }

  return { error: 'Unknown action' }
}

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}

// Review Card Component
const ReviewCard = ({
  review,
}: {
  review: { id: string; author: string; avatar: string; rating: number; date: string; comment: string }
}) => {
  return (
    <div className="flex gap-4 rounded-lg border border-border bg-background p-4">
      {/* Avatar */}
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
        {review.avatar ? (
          <img src={review.avatar} alt={review.author} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-foreground/50">
            <FaUser className="h-5 w-5" />
          </div>
        )}
      </div>
      {/* Content */}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-medium text-foreground">{review.author}</span>
          <span className="text-xs text-foreground/60">{review.date}</span>
        </div>
        <StarRating rating={review.rating} />
        <p className="mt-1 text-sm text-foreground/80">{review.comment}</p>
      </div>
    </div>
  )
}

export const VendorProfile = ({ loaderData }: Route.ComponentProps) => {
  const { store, reviews, categories } = loaderData

  // Edit states
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [editName, setEditName] = useState(store.name)
  const [editCategory, setEditCategory] = useState(store.categoryId)
  const [editDescription, setEditDescription] = useState(store.description)

  // File input refs
  const headerInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const headerFormRef = useRef<HTMLFormElement>(null)
  const logoFormRef = useRef<HTMLFormElement>(null)

  // Preview states for images
  const [headerPreview, setHeaderPreview] = useState(store.headerUrl)
  const [logoPreview, setLogoPreview] = useState(store.logoUrl)

  // Blob URL refs for cleanup
  const headerBlobRef = useRef<string | null>(null)
  const logoBlobRef = useRef<string | null>(null)

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (headerBlobRef.current) URL.revokeObjectURL(headerBlobRef.current)
      if (logoBlobRef.current) URL.revokeObjectURL(logoBlobRef.current)
    }
  }, [])

  const handleHeaderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Revoke previous blob URL
      if (headerBlobRef.current) {
        URL.revokeObjectURL(headerBlobRef.current)
      }

      const url = URL.createObjectURL(file)
      headerBlobRef.current = url
      setHeaderPreview(url)

      // Auto-submit the form
      headerFormRef.current?.requestSubmit()
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Revoke previous blob URL
      if (logoBlobRef.current) {
        URL.revokeObjectURL(logoBlobRef.current)
      }

      const url = URL.createObjectURL(file)
      logoBlobRef.current = url
      setLogoPreview(url)

      // Auto-submit the form
      logoFormRef.current?.requestSubmit()
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Store Profile</h1>
        <div className="flex items-center gap-2">
          <Link
            to={`/marketplace/vendors/${store.id}`}
            target="_blank"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            <FaExternalLinkAlt className="h-3 w-3" /> Preview Store
          </Link>
          {!store.verified && (
            <button
              type="button"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Verify Store
            </button>
          )}
        </div>
      </div>

      {/* Header & Logo Section */}
      <div className="relative">
        {/* Header Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 to-primary/40 md:h-56">
          {headerPreview ? (
            <img src={headerPreview} alt="Store header" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-foreground/30">
              <span className="text-lg">No header image</span>
            </div>
          )}
          {/* Edit button for header */}
          <button
            type="button"
            onClick={() => headerInputRef.current?.click()}
            className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <FaCamera className="h-4 w-4" /> Edit Cover
          </button>
          {/* Hidden form for header upload */}
          <Form ref={headerFormRef} method="post" encType="multipart/form-data" className="hidden">
            <input type="hidden" name="intent" value="updateHeader" />
            <input
              ref={headerInputRef}
              type="file"
              name="headerImage"
              accept="image/*"
              onChange={handleHeaderUpload}
            />
          </Form>
        </div>

        {/* Logo */}
        <div className="absolute -bottom-12 left-6 md:left-8">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-xl border-4 border-background bg-muted shadow-lg md:h-28 md:w-28">
              {logoPreview ? (
                <img src={logoPreview} alt="Store logo" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-3xl font-bold text-primary">
                  {store.name.charAt(0)}
                </div>
              )}
            </div>
            {/* Edit button for logo */}
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90"
            >
              <FaPen className="h-3 w-3" />
            </button>
            {/* Hidden form for logo upload */}
            <Form ref={logoFormRef} method="post" encType="multipart/form-data" className="hidden">
              <input type="hidden" name="intent" value="updateLogo" />
              <input
                ref={logoInputRef}
                type="file"
                name="logoImage"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </Form>
          </div>
        </div>
      </div>

      {/* Spacer for logo overlap */}
      <div className="h-8" />

      {/* Store name and verified badge (below header) */}
      <div className="flex items-center gap-3 pl-2">
        <h2 className="text-xl font-bold text-foreground">{store.name}</h2>
        <VerifiedBadge verified={store.verified} />
      </div>

      {/* About Section */}
      <ProfileSection
        title="About"
        action={
          !isEditingAbout ? (
            <button
              type="button"
              onClick={() => setIsEditingAbout(true)}
              className="flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80"
            >
              <FaPen className="h-3 w-3" /> Edit
            </button>
          ) : null
        }
      >
        {isEditingAbout ? (
          <Form method="post" className="flex flex-col gap-4">
            <input type="hidden" name="intent" value="updateAbout" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Business Name</span>
                <input
                  type="text"
                  name="storeName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Category</span>
                <select
                  name="storeCategory"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">Description</span>
              <textarea
                name="storeDescription"
                rows={4}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditingAbout(false)
                  setEditName(store.name)
                  setEditCategory(store.categoryId)
                  setEditDescription(store.description)
                }}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <FaTimes className="h-3 w-3" /> Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </Form>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-foreground/60">Business Name</span>
                <span className="font-medium text-foreground">{store.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-foreground/60">Category</span>
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-sm font-medium text-primary">
                  {store.category}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-foreground/60">Description</span>
              <p className="text-sm text-foreground/80">
                {store.description || 'No description provided.'}
              </p>
            </div>
          </div>
        )}
      </ProfileSection>

      {/* Reviews Section */}
      <ProfileSection title="Customer Reviews">
        {/* Rating Summary */}
        <div className="mb-4 flex items-center gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-500">
              <FaStar className="h-6 w-6" />
              <span className="text-2xl font-bold text-foreground">{store.rating}</span>
            </div>
            <span className="text-foreground/60">/5</span>
          </div>
          <span className="text-sm text-foreground/70">
            Based on {store.reviewCount.toLocaleString()} review{store.reviewCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Reviews List */}
        <div className="flex flex-col gap-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-foreground/60">No reviews yet.</p>
          ) : (
            reviews.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </div>

        {/* View All Link */}
        {store.reviewCount > reviews.length && (
          <div className="mt-4 text-center">
            <Link
              to="/vendor/reviews"
              className="text-sm font-medium text-primary transition hover:text-primary/80"
            >
              View all {store.reviewCount.toLocaleString()} reviews →
            </Link>
          </div>
        )}
      </ProfileSection>
    </div>
  )
}

export default VendorProfile