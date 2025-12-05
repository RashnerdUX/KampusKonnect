import type { Route } from "./+types/playground";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { Form, data, redirect } from "react-router";

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
  const email = formData.get("email") as string;
  const user_id = formData.get("user-id") as string;

  console.log("Submitted email from playground form:", email);
  console.log("Submitted user ID from playground form:", user_id);
  
  
  // Get service role key
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.");
  }

  const { supabase, headers } = createSupabaseServerClient(request, serviceRoleKey);

  // Update user's email in Supabase Auth
  const {data: updatedUserData, error: updatedUserError} = await supabase.auth.admin.updateUserById(
    user_id,
    {
      email_confirm: true,
    }
  )

  if (updatedUserError) {
    console.error("Error updating user email in Supabase Auth:", updatedUserError);
    return data({ success:false, error: true, message: updatedUserError.message }, { headers });
  }

  console.log("Successfully updated user email in Supabase Auth:", updatedUserData);
  return data({ success: true, error: false, message: "User is now confirmed." }, { headers });
}

export default function Playground({actionData}: Route.ComponentProps) {

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-2">
        <h1>Playground</h1>
        <p>This is a playground route for testing and experimentation.</p>
        <p> Playground will also be used to do some data manipulation which is why it's only accessible to admins. </p>
      </div>

      <div className="flex items-center justify-center w-full">
        {actionData?.success && (<p className="text-green-600 mb-2">{actionData?.message}</p>
        )}
        {actionData?.error && (
          <p className="text-red-600 mb-2">Error: {actionData?.message}</p>
        )}
        <Form method="post" className="flex flex-col">
          <input type="text" name="user-id" id="user-id" />
          <input type="email" name="email" id="email" />
          <button type="submit" className="bg-secondary text-secondary-foreground text-sm font-medium py-2 px-6 rounded-full"> Submit </button>
        </Form>
      </div>
    </div>
  );
}