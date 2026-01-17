// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

console.log("Hello from Edge Functions!")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  console.log("Working on product descriptions")

  const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')

  if (!hfToken) {
    console.log("There is no hugging face access token");
    return new Response(
      "Hugging Face Access Token not available",
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }

  console.log("There is an hugging face access token")

  const hf = new HfInference(hfToken)

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200 
    })
  }
  
  // Reject any other request that isn't POST
  if (req.method !== "POST"){
    return new Response("Method not allowed", {
      headers: {...corsHeaders},
      status: 503,
    });
  }

  // Image is received via form data as blob
  const formData = await req.formData();
  const imageFile = formData.get('image') as File;

  let imageBytes: Uint8Array;

  if (!imageFile) {
    return new Response(
      "No image provided in the response",
      { status: 405 }
    )
  };

  console.log("Image File: ", imageFile.name, imageFile.type, imageFile.size);

  const arrayBuffer = await imageFile.arrayBuffer();
  imageBytes = new Uint8Array(arrayBuffer);

  console.log("Image has been obtained for the HF AI");

  // Create text from the image
  console.log("Calling Hugging Face API...");

  try {
    // Create the blob

    const description = await hf.imageToText(
      {
        data: imageBytes,
        model: 'Qwen/Qwen2.5-VL-7B-Instruct',
      }
    );

    console.log("HF response:", description);

    return new Response(
      JSON.stringify({description: description}),
      { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 200 },
    )
  } catch (error) {
    console.error("There was an error generating product description", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    return new Response(
      JSON.stringify({}),
      {headers: { "Content-Type": "application/json"}, status: 500}
    )
  };
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-product-descriptions' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
