/**
 * Batch Embedding Generation Script
 * 
 * This script generates embeddings for all products that don't have them yet.
 * It uses the get_products_needing_embeddings RPC function to fetch products
 * and updates them with embeddings from OpenAI.
 * 
 * Usage:
 *   npx tsx app/scripts/generate-embeddings.ts
 * 
 * Environment Variables Required:
 *   - OPENAI_API_KEY: Your OpenAI API key
 *   - SUPABASE_URL: Your Supabase project URL
 *   - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key (for admin access)
 */

import { createClient } from '@supabase/supabase-js'

// Configuration
const BATCH_SIZE = 50
const DELAY_BETWEEN_BATCHES_MS = 1000
const OPENAI_MODEL = 'text-embedding-3-small'

interface ProductForEmbedding {
  id: string
  title: string
  description: string | null
  category_name: string | null
  combined_text: string
}

interface EmbeddingResponse {
  object: string
  data: Array<{
    object: string
    index: number
    embedding: number[]
  }>
  model: string
  usage: {
    prompt_tokens: number
    total_tokens: number
  }
}

async function generateEmbedding(text: string, apiKey: string): Promise<number[] | null> {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: OPENAI_MODEL,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`OpenAI API error: ${response.status} - ${errorText}`)
      return null
    }

    const data: EmbeddingResponse = await response.json()
    return data.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    return null
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  console.log('🚀 Starting batch embedding generation...\n')

  // Validate environment variables
  const openaiApiKey = process.env.OPENAI_API_KEY
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!openaiApiKey) {
    console.error('❌ OPENAI_API_KEY environment variable is required')
    process.exit(1)
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required')
    process.exit(1)
  }

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  let totalProcessed = 0
  let totalErrors = 0
  let hasMore = true

  while (hasMore) {
    console.log(`📦 Fetching batch of ${BATCH_SIZE} products needing embeddings...`)

    // Fetch products that need embeddings
    const { data: products, error: fetchError } = await supabase
      .rpc('get_products_needing_embeddings', { batch_size: BATCH_SIZE })

    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError.message)
      process.exit(1)
    }

    if (!products || products.length === 0) {
      console.log('✅ No more products need embeddings!')
      hasMore = false
      break
    }

    console.log(`   Found ${products.length} products to process\n`)

    for (const product of products as ProductForEmbedding[]) {
      const textToEmbed = product.combined_text || 
        `${product.title} ${product.description || ''} ${product.category_name || ''}`.trim()

      if (!textToEmbed) {
        console.log(`⚠️  Skipping product ${product.id} - no text to embed`)
        continue
      }

      console.log(`   Processing: ${product.title.substring(0, 50)}...`)

      const embedding = await generateEmbedding(textToEmbed, openaiApiKey)

      if (!embedding) {
        console.log(`   ❌ Failed to generate embedding for ${product.id}`)
        totalErrors++
        continue
      }

      // Update product with embedding
      const { error: updateError } = await supabase
        .from('store_listings')
        .update({ embedding: embedding })
        .eq('id', product.id)

      if (updateError) {
        console.log(`   ❌ Failed to update product ${product.id}: ${updateError.message}`)
        totalErrors++
        continue
      }

      totalProcessed++
      console.log(`   ✅ Embedded (${totalProcessed} total)`)

      // Small delay to avoid rate limiting
      await sleep(100)
    }

    if (products.length < BATCH_SIZE) {
      hasMore = false
    } else {
      console.log(`\n⏳ Waiting ${DELAY_BETWEEN_BATCHES_MS}ms before next batch...\n`)
      await sleep(DELAY_BETWEEN_BATCHES_MS)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Summary:')
  console.log(`   ✅ Successfully processed: ${totalProcessed} products`)
  console.log(`   ❌ Errors: ${totalErrors}`)
  console.log('='.repeat(50))
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
