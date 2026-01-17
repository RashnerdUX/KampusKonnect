// API route for hybrid product search
import { data } from 'react-router';
import type { Route } from '../+types/api.search';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { generateEmbedding } from '~/utils/embeddings.server';
import type { SearchParams, SearchResponse, SearchResultProduct } from '~/types/search.types';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const DEFAULT_FULL_TEXT_WEIGHT = 0.5;
const DEFAULT_SEMANTIC_WEIGHT = 0.5;

/**
 * Escapes special LIKE/ILIKE pattern characters in user input
 * to prevent wildcard injection attacks.
 * 
 * @param input - Raw user input string
 * @returns Escaped string safe for use in LIKE patterns
 */
function escapeLikePattern(input: string): string {
  return input
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/%/g, '\\%')     // Escape percent signs
    .replace(/_/g, '\\_');    // Escape underscores
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  
  // Parse query parameters
  const query = url.searchParams.get('q') || '';
  const categoryId = url.searchParams.get('category') || undefined;
  const universityId = url.searchParams.get('university') || undefined;
  const minPrice = url.searchParams.get('minPrice') ? parseFloat(url.searchParams.get('minPrice')!) : undefined;
  const maxPrice = url.searchParams.get('maxPrice') ? parseFloat(url.searchParams.get('maxPrice')!) : undefined;
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(url.searchParams.get('limit') || String(DEFAULT_LIMIT), 10)));
  const fullTextWeight = parseFloat(url.searchParams.get('ftWeight') || String(DEFAULT_FULL_TEXT_WEIGHT));
  const semanticWeight = parseFloat(url.searchParams.get('semWeight') || String(DEFAULT_SEMANTIC_WEIGHT));

  const { supabase, headers } = createSupabaseServerClient(request);

  // If no query, return empty results
  if (!query.trim()) {
    const response: SearchResponse = {
      success: true,
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
      query: '',
    };
    return data(response, { headers });
  }

  try {
    // Generate embedding for the search query
    let queryEmbedding: number[] | null = null;
    try {
      const embeddingResult = await generateEmbedding(query);
        queryEmbedding = embeddingResult.embedding;
    } catch (embeddingError) {
      console.error('Embedding generation error:', embeddingError);
    }

    // Calculate match count for hybrid search (fetch more than needed for filtering)
    const matchCount = limit * 5; // Fetch extra for post-filtering

    // Convert embedding array to string format for Supabase vector
    // If embedding generation failed, fallback to full-text search only
    const embeddingString = queryEmbedding ? `[${queryEmbedding.join(',')}]` : '';

    // Call the hybrid search function
    const { data: searchResults, error: searchError } = await supabase.rpc(
      'hybrid_search_products',
      {
        query_text: query,
        query_embedding: embeddingString,
        match_count: matchCount,
        full_text_weight: queryEmbedding ? fullTextWeight : 1.0, // Use full-text only if no embedding
        semantic_weight: queryEmbedding ? semanticWeight : 0.0,
      }
    );

    if (searchError) {
      console.error('Hybrid search error:', searchError);
      const response: SearchResponse = {
        success: false,
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        query,
        error: 'Search failed. Please try again.',
      };
      return data(response, { status: 500, headers });
    }

    // Apply additional filters
    let filteredResults = searchResults || [];

    // Filter by category
    if (categoryId) {
      filteredResults = filteredResults.filter((p: any) => p.category_id === categoryId);
    }

    // Filter by university (requires joining with store -> user_profile -> university)
    // This assumes your hybrid_search_products returns university_id or we filter on client
    if (universityId) {
      filteredResults = filteredResults.filter((p: any) => p.university_id === universityId);
    }

    // Filter by price range
    if (minPrice !== undefined) {
      filteredResults = filteredResults.filter((p: any) => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      filteredResults = filteredResults.filter((p: any) => p.price <= maxPrice);
    }

    // Calculate pagination
    const total = filteredResults.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);

    // Map to response format
    const products: SearchResultProduct[] = paginatedResults.map((p: any) => ({
      id: p.id,
      store_id: p.store_id,
      title: p.title,
      description: p.description,
      price: p.price,
      image_url: p.image_url,
      category_id: p.category_id,
      category_name: p.category_name,
      stock_quantity: p.stock_quantity,
      is_active: p.is_active,
      store_name: p.store_name,
      university_short_code: p.university_short_code,
      relevance_score: p.score || 0,
    }));

    const response: SearchResponse = {
      success: true,
      data: products,
      pagination: { page, limit, total, totalPages },
      query,
    };

    return data(response, { headers });

  } catch (error) {
    console.error('Search error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's a rate limit error
    if (errorMessage.includes('Rate limited')) {
      const response: SearchResponse = {
        success: false,
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        query,
        error: 'Search is temporarily unavailable. Please try again in a moment.',
      };
      return data(response, { status: 429, headers });
    }

    const response: SearchResponse = {
      success: false,
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
      query,
      error: 'An error occurred while searching. Please try again.',
    };
    return data(response, { status: 500, headers });
  }
}

// Also handle POST for search recommendations
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const query = formData.get('q') as string || '';
  const limit = Math.min(10, parseInt(formData.get('limit') as string || '5', 10));

  const { supabase, headers } = createSupabaseServerClient(request);

  if (!query.trim() || query.length < 2) {
    return data({ success: true, recommendations: [] }, { headers });
  }

  try {
    // Escape special LIKE characters to prevent wildcard injection
    const escapedQuery = escapeLikePattern(query.trim());
    
    // Use simple text search for recommendations (faster, no embedding needed)
    const { data: recommendations, error } = await supabase
      .from('store_listings')
      .select(`
        id,
        title,
        price,
        image_url,
        category:categories(name)
      `)
      .ilike('title', `%${escapedQuery}%`)
      .eq('is_active', true)
      .gt('stock_quantity', 0)
      .limit(limit);

    if (error) {
      console.error('Recommendations error:', error);
      return data({ success: false, recommendations: [], error: 'Failed to fetch recommendations' }, { headers });
    }

    const formattedRecommendations = (recommendations || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      category_name: p.category?.name || null,
      image_url: p.image_url,
      price: p.price,
    }));

    return data({ success: true, recommendations: formattedRecommendations }, { headers });

  } catch (error) {
    console.error('Recommendations error:', error);
    return data({ success: false, recommendations: [], error: 'An error occurred' }, { headers });
  }
}
