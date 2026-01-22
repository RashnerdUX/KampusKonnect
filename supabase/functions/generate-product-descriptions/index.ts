// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { InferenceClient } from 'https://esm.sh/@huggingface/inference@latest'

console.log("Hello from Edge Functions!")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  console.log("Working on product descriptions")

    // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200 
    })
  }

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

  console.log("Going ahead with the HF token provided...")

  const client = new InferenceClient(hfToken)
  
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

  // Get additional information to imporve product copy
  const category =
    (formData.get("category") as string) ?? "General product"
  const audience =
    (formData.get("audience") as string) ?? "General consumers"
  const tone =
    (formData.get("tone") as string) ?? "Clear and professional"

  // Confirm the availability of the Image file
  if (!imageFile) {
    return new Response(
      "No image provided in the response",
      { status: 405 }
    )
  };

  console.log("Here's the Image File: ", imageFile.name, imageFile.type, imageFile.size);

  console.log("Image has been obtained for the HF Client. Proceeding...");

  // Create text from the image
  console.log("Calling Hugging Face API...");

  try {

    // First use Salesforce Model to describe image
    const visionResult = await client.imageToText(
      {
        model: "nlpconnect/vit-gpt2-image-captioning",
        data: imageFile,
      }
    );

    console.log("Salesforce result received!", visionResult);

    const visionDescription = typeof visionResult === "string" ? visionResult : visionResult?.generated_text ?? "";

    if (!visionDescription) {
      throw new Error("Failed to retrieve the generated visual description of the product");
    };

    // Next, refine the description with Qwen VL model

    const descriptionInfo = await client.chat.completions.create({
      model: "Qwen/Qwen2.5-7B-Instruct",
      messages: [
        {
          role: "system",
          content: `
You are an ecommerce copywriter.

Rules:
- Write accurate descriptions based ONLY on provided visual attributes
- Do not invent features, materials, or brands
- Do not exaggerate or use hype
- Use a neutral, professional tone
- 2–3 sentences maximum
          `.trim(),
        },
        {
          role: "user",
          content: `
Product category: ${category}
Target audience: ${audience}
Tone: ${tone}

Visible attributes from image:
${visualFacts}

Write a short ecommerce product description.
          `.trim(),
        },
      ],
      max_tokens: 120,
    });

    const description = descriptionInfo.choices?.[0]?.message?.content ?? "";

    if(!description){
      throw new Error("Failed to generate product description");
    };

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
      JSON.stringify({
        error: `Failed to generate product description. Here's the error: {error.message}`,
      }),
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
