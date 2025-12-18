import { redirect } from "react-router";
import type { Route } from "./+types/university.$slug";

export async function loader({ params }: Route.LoaderArgs) {
  const universitySlug = params.slug;
  // Redirect to the main products page with the university filter
  return redirect(
    `/marketplace/products?university=${encodeURIComponent(universitySlug)}`,
    { status: 301 }
  );
}