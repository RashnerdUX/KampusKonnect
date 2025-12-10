// OpenAI embedding generation utility
import type { EmbeddingResult } from '~/types/search.types';

const OPENAI_API_URL = 'https://api.openai.com/v1/embeddings';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 1536;

/**
 * Generate an embedding for a given text using OpenAI's text-embedding-3-small model
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined in environment variables');
  }

  // Clean and prepare text
  const cleanedText = text.trim().replace(/\n+/g, ' ').slice(0, 8000); // Max ~8000 chars for safety

  if (!cleanedText) {
    throw new Error('Text cannot be empty');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: cleanedText,
      dimensions: EMBEDDING_DIMENSIONS,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    
    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || '60';
      throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
    }
    
    throw new Error(`OpenAI API error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();

  return {
    embedding: data.data[0].embedding,
    model: data.model,
    usage: data.usage,
  };
}

/**
 * Generate embeddings for multiple texts in batch
 * OpenAI supports batch embedding in a single request
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined in environment variables');
  }

  if (texts.length === 0) {
    return [];
  }

  // Clean texts
  const cleanedTexts = texts.map(text => 
    text.trim().replace(/\n+/g, ' ').slice(0, 8000)
  );
  
  const emptyIndices = cleanedTexts
    .map((text, i) => text.length === 0 ? i : -1)
    .filter(i => i >= 0);
  
  if (emptyIndices.length > 0) {
    throw new Error(`Empty text at indices: ${emptyIndices.join(', ')}`);
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: cleanedTexts,
      dimensions: EMBEDDING_DIMENSIONS,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || '60';
      throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
    }
    
    throw new Error(`OpenAI API error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();

  // Sort by index to maintain order
  const sortedData = data.data.sort((a: any, b: any) => a.index - b.index);
  
  return sortedData.map((item: any) => item.embedding);
}

/**
 * Create a combined text for embedding from product title and description
 */
export function createProductEmbeddingText(title: string, description: string | null): string {
  const parts = [title];
  if (description) {
    parts.push(description);
  }
  return parts.join('. ');
}

/**
 * Sleep utility for rate limiting
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
