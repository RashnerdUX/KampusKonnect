import React, { useState } from 'react'
import { Form, Link } from 'react-router'
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa'

export const meta = () => {
  return [
    { title: 'Select Your Interests - Kampus Konnect' },
    { name: 'description', content: 'Choose categories you are interested in.' },
  ]
}

export const action = async () => {
  // TODO: Save student interests to database
  return null
}

const CATEGORIES = [
  { id: 'food', label: 'Food & Beverages', emoji: '🍔', description: 'Meals, snacks, drinks' },
  { id: 'electronics', label: 'Electronics', emoji: '📱', description: 'Phones, laptops, gadgets' },
  { id: 'fashion', label: 'Fashion', emoji: '👗', description: 'Clothes, shoes, accessories' },
  { id: 'books', label: 'Books & Stationery', emoji: '📚', description: 'Textbooks, notes, supplies' },
  { id: 'beauty', label: 'Beauty & Personal Care', emoji: '💄', description: 'Skincare, makeup, grooming' },
  { id: 'services', label: 'Services', emoji: '🛠️', description: 'Laundry, repairs, tutoring' },
  { id: 'health', label: 'Health & Wellness', emoji: '💪', description: 'Pharmacy, fitness, supplements' },
  { id: 'home', label: 'Home & Living', emoji: '🏠', description: 'Bedding, decor, appliances' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎮', description: 'Games, events, streaming' },
  { id: 'transport', label: 'Transport', emoji: '🚗', description: 'Rides, deliveries, logistics' },
  { id: 'art', label: 'Art & Crafts', emoji: '🎨', description: 'Handmade, custom designs' },
  { id: 'sports', label: 'Sports & Outdoor', emoji: '⚽', description: 'Equipment, jerseys, gear' },
]

interface CategoryCardProps {
  id: string
  label: string
  emoji: string
  description: string
  selected: boolean
  onToggle: (id: string) => void
}

const CategoryCard = ({ id, label, emoji, description, selected, onToggle }: CategoryCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all ${
        selected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
      }`}
    >
      {/* Checkmark */}
      {selected && (
        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <FaCheck className="h-3 w-3" />
        </div>
      )}

      {/* Emoji */}
      <span className="text-3xl">{emoji}</span>

      {/* Label */}
      <span className="font-semibold text-foreground">{label}</span>

      {/* Description */}
      <span className="text-xs text-foreground/60">{description}</span>

      {/* Hidden input for form submission */}
      {selected && <input type="hidden" name="interests" value={id} />}
    </button>
  )
}

export default function StudentInterests() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleCategory = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const isValid = selectedIds.size >= 3

  return (
    <div className="w-full max-w-3xl">
      {/* Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-foreground">What are you interested in?</h1>
          <p className="text-foreground/70">
            Select at least <span className="font-semibold text-primary">3 categories</span> to
            personalize your feed
          </p>
        </div>

        {/* Selection count */}
        <div className="mb-4 flex items-center justify-center">
          <div
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              isValid
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-muted text-foreground/70'
            }`}
          >
            {selectedIds.size} of 3 minimum selected
            {isValid && ' ✓'}
          </div>
        </div>

        {/* Form */}
        <Form method="post">
          {/* Categories Grid */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {CATEGORIES.map((category) => (
              <CategoryCard
                key={category.id}
                {...category}
                selected={selectedIds.has(category.id)}
                onToggle={toggleCategory}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Link
              to="/onboarding/student/profile"
              className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 font-medium text-foreground transition hover:bg-muted"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <button
              type="submit"
              disabled={!isValid}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Complete Setup
              <FaArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}
