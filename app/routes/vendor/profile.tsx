import React, { useState, useRef } from 'react'
import type { Route } from './+types/profile';
import { Form, Link } from 'react-router'
import { FaExternalLinkAlt, FaStar, FaPen, FaTimes, FaCamera, FaUser } from 'react-icons/fa'

import VerifiedBadge from '~/components/dashboard/VerifiedBadge'
import ProfileSection from '~/components/dashboard/ProfileSection'

// Sample store data – replace with loader data
const sampleStore = {
  id: 'store-123',
  name: 'TechStore',
  description: 'Cutting-edge gadgets and accessories for the modern student. We provide the latest tech products at affordable prices, perfect for university life.',
  category: 'Electronics',
  logoUrl: '',
  headerUrl: '',
  verified: true,
  rating: 4.8,
  reviewCount: 1320,
}

// Sample reviews
const sampleReviews = [
  {
    id: '1',
    author: 'John D.',
    avatar: '',
    rating: 5,
    date: '2 days ago',
    comment: 'Amazing products and super fast delivery! Highly recommend this store.',
  },
  {
    id: '2',
    author: 'Sarah M.',
    avatar: '',
    rating: 4,
    date: '1 week ago',
    comment: 'Good quality items. Customer service was helpful when I had questions.',
  },
  {
    id: '3',
    author: 'Mike K.',
    avatar: '',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Best prices on campus! Will definitely buy again.',
  },
]

const CATEGORY_OPTIONS = [
  'Electronics',
  'Fashion',
  'Food & Beverages',
  'Books & Stationery',
  'Health & Wellness',
  'Services',
  'Other',
]

export const meta = () => {
  return [
    { title: 'Store Profile - Campex' },
    { name: 'description', content: 'Manage your store profile on Campex' },
  ]
}

export const loader = async () => {
  // TODO: fetch store from database
  return { store: sampleStore, reviews: sampleReviews }
}

export const action = async () => {
  // TODO: handle profile update
  // TODO: Ensure you switch the button type on the profile update button and bring the logic from the function into here
  return null
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

export const VendorProfile = ({loaderData}: Route.ComponentProps) => {
  
  const { store, reviews } = loaderData;

  // Edit states
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [editName, setEditName] = useState(store.name)
  const [editCategory, setEditCategory] = useState(store.category)
  const [editDescription, setEditDescription] = useState(store.description)

  // File input refs
  const headerInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Preview states for images
  const [headerPreview, setHeaderPreview] = useState(store.headerUrl)
  const [logoPreview, setLogoPreview] = useState(store.logoUrl)

  const handleHeaderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setHeaderPreview(url)
      // TODO: upload to Supabase
    }

    // After uploading revoke url
    if (headerPreview){
      URL.revokeObjectURL(headerPreview);
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLogoPreview(url)
      // TODO: upload to Supabase
    }

    // After uploading revoke url
    if (logoPreview){
      URL.revokeObjectURL(logoPreview);
    }
  }

  const handleSaveAbout = () => {
    // TODO: save to database
    setIsEditingAbout(false)
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
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
          <input
            ref={headerInputRef}
            type="file"
            accept="image/*"
            onChange={handleHeaderUpload}
            className="hidden"
          />
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
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Business Name</span>
                <input
                  type="text"
                  name="storeName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Category</span>
                <select
                  name="storeCategory"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
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
                  setEditCategory(store.category)
                  setEditDescription(store.description)
                }}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <FaTimes className="h-3 w-3" /> Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAbout}
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
              <p className="text-sm text-foreground/80">{store.description}</p>
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
            Based on {store.reviewCount.toLocaleString()} reviews
          </span>
        </div>

        {/* Reviews List */}
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* View All Link */}
        {reviews.length > 0 && (
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