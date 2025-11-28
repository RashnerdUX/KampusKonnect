import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Landing Page
  index("routes/landingpage.tsx"),
  route("join-waitlist/success", "routes/waitlist_success.tsx"),

  // The Application Routes
  route("app", "routes/home.tsx"),

  // Authentication
  route("login", "routes/auth/login.tsx"),
  route("register", "routes/auth/register.tsx"),
  route("auth/callback", "routes/auth/auth.callback.tsx"),

  // Onboarding Routes

  // Marketplace Routes
  route("marketplace", "routes/marketplace/_layout.tsx", [
    index("routes/marketplace/index.tsx"),
  ]),

  // Vendor Routes
  route("vendor/new", "routes/vendor.new.tsx"),
  route("vendor/:id", "routes/vendor.$id.tsx"),
  route("vendor/:id/review", "routes/vendor.$id.review.tsx"),

  // Vendor Dashboard Routes
  route("vendor", "routes/vendor/_layout.tsx", {id: "VendorLayout"}, [
    index("routes/vendor/index.tsx"),
    route("products", "routes/vendor/products.tsx"),
    route("product/add", "routes/vendor/product.add.tsx"),
    route("profile", "routes/vendor/profile.tsx"),
    route("settings", "routes/vendor/settings.tsx"),
  ]),

  // For testing and experimentation
  route("playground", "routes/playground.tsx"),
] satisfies RouteConfig;
