import { redirect } from "react-router";
import type { Route } from "./+types/category.$slug";

export async function loader({ params }: Route.LoaderArgs) {
  const categorySlug = params.slug;
  return redirect(
    `/marketplace/products?category=${encodeURIComponent(categorySlug)}`,
    { status: 301 }
  );
}