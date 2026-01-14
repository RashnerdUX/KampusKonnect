import type { Route } from "../+types/playground";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { Form, data, redirect, useNavigation } from "react-router";
import ThemeToggle from "~/components/ThemeToggle";
import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/utils/database.types";
import ButtonSpinner from "~/components/ButtonSpinner";

// Custom functions that I'll move to an utils folder later
export const confirmUserOnSupabase = async (supabase: SupabaseClient<Database>, headers: Headers, user_id: string) => {
  // Update user's email in Supabase Auth
  const {data: updatedUserData, error: updatedUserError} = await supabase.auth.admin.updateUserById(
    user_id,
    {
      email_confirm: true,
    }
  );

  if (updatedUserError) {
    console.error("Error updating user email in Supabase Auth:", updatedUserError);
    return data({ success: false, error: true, message: updatedUserError.message, publicUrl: "" }, { headers });
  }

  return data({ success: true, error: false, message: "User successfully confirmed", publicUrl: "" }, { headers });
}

export const handleImageUpload = async (supabase: SupabaseClient<Database>, headers: Headers, user_id: string, file: File, imageType: string) => {
  // Define the storage path based on image type
  let storagePath = `${user_id}/${imageType}-${Date.now()}`;
  let bucketName = "";
  if (imageType === "header") {
    bucketName = "store_header_images";
  } else if (imageType === "logo") {
    bucketName = "store_logos";
  }

  // Upload the image to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from(bucketName)
    .upload(storagePath, file);

  if (uploadError) {
    console.error("Error uploading image to Supabase Storage:", uploadError);
    return data({ success: false, error: true, message: uploadError.message }, { });
  }

  // Get the public URL of the uploaded image
  const { data: publicUrlData } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(uploadData.path);
  
  return data({ success: true, error: false, message: "Image uploaded successfully", publicUrl: publicUrlData.publicUrl }, { headers });
}

export const meta = (_args: Route.MetaArgs) => {
  return [
    { title: "Playground - Campex" },
    { name: "description", content: "A playground route for testing and experimentation." }
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  // Playground will only be accessible to admins
  const { supabase, headers } = createSupabaseServerClient(request);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login", { headers });
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile in playground loader:", profileError);
    throw new Error("Failed to fetch user profile.");
  }

  if (profile.role !== "admin") {
    if (profile.role === "student") {
      return redirect("/marketplace", { headers });
    } else if (profile.role === "vendor") {
      return redirect("/vendor", { headers });
    }
  }

  return data({ isAdmin: true }, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("action") as string;
  const email = formData.get("email") as string;
  const user_id = formData.get("user-id") as string;
  const storeImageType = formData.get("store-image") as string;

  // Get the files
  const fileList = formData.getAll("image") as File[];
  const file = fileList[0];

  console.log("Submitted email from playground form:", email);
  console.log("Submitted user ID from playground form:", user_id);
  
  // Get service role key
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.");
  }

  const { supabase, headers } = createSupabaseServerClient(request, serviceRoleKey);

    // Handle different actions based on the form submission
  switch (action) {
    case "upload-image":
      return await handleImageUpload(supabase, headers, user_id, file, storeImageType);
    case "confirm-user":
      return await confirmUserOnSupabase(supabase, headers, user_id);
    default:
      return data({ success: false, error: true, message: "Invalid action.", publicUrl: "" }, { headers });
  }
}

export default function Playground({actionData}: Route.ComponentProps) {

  const [publicUrl, setPublicUrl] = useState("");
  const [isPublicUrlGenerated, setIsPublicUrlGenerated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigation = useNavigation();
  if (navigation.state === "submitting" && !isSubmitting) {
    setIsSubmitting(true);
  }

  if (actionData?.publicUrl && !isPublicUrlGenerated) {
    setPublicUrl(actionData.publicUrl);
    setIsPublicUrlGenerated(true);
  }

  return (
    <div className="relative min-h-screen">
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2 max-w-5xl p-4 mt-8 mb-4 text-center">
          <h1 className="text-foreground text-2xl font-bold font-display">Playground</h1>
          <p className="text-foreground/80 text-base font-medium">This is a playground route for testing and experimentation. Playground will also be used to do some data manipulation which is why it's only accessible to admins.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl p-4">

          {/* Form for confirming user on Supabase */}
          <div className="flex flex-col items-center justify-center border-2 border-border p-4 m-4 rounded-lg">
            <h2 className="text-foreground font-bold text-xl font-display"> Confirm User on Supabase </h2>
            {actionData?.success && (<p className="text-green-600 mb-2">{actionData?.message}</p>
            )}
            {actionData?.error && (
              <p className="text-red-600 mb-2">Error: {actionData?.message}</p>
            )}
            <Form method="post" className="flex flex-col items-center gap-4 mt-4 w-full">
              <input type="hidden" name="action" id="action" value="confirm-user" className="input-field mb-2" />
              <input type="text" name="user-id" id="user-id" className="input-field" placeholder="Enter the user-id from Supabase"/>
              <button type="submit" className="bg-secondary text-secondary-foreground text-sm font-medium py-4 px-6 rounded-full w-full"> Submit </button>
            </Form>
          </div>

          {/* Form for uploading items for users */}
          <div className="flex flex-col items-center justify-center w-full border-2 border-border p-4 m-4 rounded-lg">
            <h2 className="text-foreground font-bold text-xl font-display"> Upload Image for User </h2>
            {actionData?.success && (<p className="text-green-600 mb-2">{actionData?.message}</p>
            )}
            {actionData?.error && (
              <p className="text-red-600 mb-2">Error: {actionData?.message}</p>
            )}
            <Form method="post" className="flex flex-col items-center gap-4 mt-4 w-full text-foreground" encType="multipart/form-data">
              <input type="hidden" name="action" id="action" value="upload-image" className="input-field mb-2" />
              <input type="file" name="image" id="image" accept="image/*" />
              <input type="text" name="user-id" id="user-id" className="input-field" placeholder="Enter the user-id from Supabase"/>
              <div>
                <input type="radio" name="store-image" id="header-image" value="header" />
                <label htmlFor="header-image">Header Image</label>
              </div>
              <div>
                <input type="radio" name="store-image" id="logo-image" value="logo" />
                <label htmlFor="logo-image">Logo Image</label>
              </div>

              <input type="text" name="public-url" id="public-url" placeholder="Awaiting Public Url" disabled value={isPublicUrlGenerated ? publicUrl : undefined} className="input-field" />
              <button type="submit" className="bg-secondary text-secondary-foreground text-sm font-medium py-4 px-6 rounded-full w-full"> Submit </button>
            </Form>
          </div>

          {/* Form to test something */}
          <div className="flex flex-col items-center justify-center border-2 border-border p-4 m-4 rounded-lg">
            <h2 className="text-foreground font-bold text-xl font-display"> Another Test Form </h2>
            <Form method="post" className="flex flex-col items-center gap-4 mt-4 w-full">
              <input type="text" name="test-input" id="test-input" className="input-field" placeholder="Enter something to test"/>
              <button type="submit" className={`bg-primary ${isSubmitting ? 'text-primary-foreground/50' : 'text-primary-foreground'} text-sm font-medium py-4 px-6 rounded-full w-full flex gap-2 items-center justify-center`}> 
                {isSubmitting && <ButtonSpinner />}
                {isSubmitting ? 'Submitting...' : ' Submit'} 
              </button>
            </Form>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}