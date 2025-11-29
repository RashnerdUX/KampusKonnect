import type { Database } from '~/utils/database.types'

type CategoryName = Database['public']['Tables']['store_categories']['Row']['name']
type UniversityName = Database['public']['Tables']['universities']['Row']['name']

export const PRODUCT_CATEGORIES: Array<{ slug: CategoryName; label: string }> = [
  { slug: 'food-beverages', label: 'Food & Beverages' },
  { slug: 'books-stationery', label: 'Books & Stationery' },
  { slug: 'electronics', label: 'Electronics' },
  { slug: 'clothing-accessories', label: 'Clothing & Accessories' },
  { slug: 'health-wellness', label: 'Health & Wellness' },
  { slug: 'services', label: 'Services' },
]

export const UNIVERSITIES: Array<{ slug: UniversityName; label: string }> = [
  { slug: 'all', label: 'All Universities' },
  { slug: 'unilag', label: 'University of Lagos' },
  { slug: 'ui', label: 'University of Ibadan' },
  { slug: 'oau', label: 'Obafemi Awolowo University' },
  // …keep in sync with supabase enum
]