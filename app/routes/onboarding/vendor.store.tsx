import React, { useState, useRef } from 'react'
import { Form, Link } from 'react-router'
import { FaArrowLeft, FaArrowRight, FaCamera, FaCloudUploadAlt } from 'react-icons/fa'

export const meta = () => {
  return [
    { title: 'Create Your Store - Kampus Konnect' },
    { name: 'description', content: 'Set up your store on Kampus Konnect.' },
  ]
}

export const action = async () => {
  // TODO: Save store to database
  return null
}

const STORE_CATEGORIES = [
  { value: 'food', label: 'Food & Beverages' },
  { value: 'electronics', label: 'Electronics & Gadgets' },
  { value: 'fashion', label: 'Fashion & Accessories' },
  { value: 'books', label: 'Books & Stationery' },
  { value: 'beauty', label: 'Beauty & Personal Care' },
  { value: 'services', label: 'Services' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'home', label: 'Home & Living' },
  { value: 'art', label: 'Art & Crafts' },
  { value: 'sports', label: 'Sports & Outdoor' },
  { value: 'other', label: 'Other' },
]

export default function VendorStore() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [headerPreview, setHeaderPreview] = useState<string | null>(null)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const headerInputRef = useRef<HTMLInputElement>(null)
  const logoBlobRef = useRef<string | null>(null)
  const headerBlobRef = useRef<string | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (logoBlobRef.current) URL.revokeObjectURL(logoBlobRef.current)
      const url = URL.createObjectURL(file)
      logoBlobRef.current = url
      setLogoPreview(url)
    }
  }

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (headerBlobRef.current) URL.revokeObjectURL(headerBlobRef.current)
      const url = URL.createObjectURL(file)
      headerBlobRef.current = url
      setHeaderPreview(url)
    }
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Create Your Store</h1>
          <p className="text-foreground/70">Set up your storefront to start selling</p>
        </div>

        {/* Form */}
        <Form method="post" encType="multipart/form-data" className="flex flex-col gap-6">
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
                {headerPreview ? (
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
                  {logoPreview ? (
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
                {STORE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
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
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Create Store
              <FaArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}
