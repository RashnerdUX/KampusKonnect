// Types for hybrid search functionality

export interface SearchFilters {
  categoryId?: string;
  universityId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface SearchParams {
  query: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
  fullTextWeight?: number;
  semanticWeight?: number;
}

export interface SearchResultProduct {
  id: string;
  store_id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  category_name: string | null;
  stock_quantity: number;
  is_active: boolean;
  store_name: string | null;
  university_short_code: string | null;
  relevance_score: number;
}

export interface SearchResponse {
  success: boolean;
  data: SearchResultProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  query: string;
  error?: string;
}

export interface SearchRecommendation {
  id: string;
  title: string;
  category_name: string | null;
  image_url: string | null;
  price: number;
}

export interface SearchRecommendationsResponse {
  success: boolean;
  recommendations: SearchRecommendation[];
  error?: string;
}

// Embedding types
export interface EmbeddingResult {
  embedding: number[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface ProductNeedingEmbedding {
  id: string;
  title: string;
  description: string | null;
}

export interface EmbeddingBatchResult {
  processed: number;
  failed: number;
  errors: string[];
}
