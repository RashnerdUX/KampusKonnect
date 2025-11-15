import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Landing Page
  index("routes/waitlist.tsx"),
  route("join-waitlist/success", "routes/waitlist_success.tsx"),

  // Main landing page
  // TODO: Make this the default route later when we launch
  route("landing", "routes/landingpage.tsx"),

  // The Application Routes
  route("app", "routes/home.tsx"),

  // Authentication
  route("login", "routes/auth/login.tsx"),
  route("register", "routes/auth/register.tsx"),
  route("auth/callback", "routes/auth/auth.callback.tsx"),

  // Onboarding Routes

  // Marketplace Routes
  route("marketplace", "routes/marketplace/index.tsx"),

  // Vendor Routes
  route("vendor/new", "routes/vendor.new.tsx"),
  route("vendor/:id", "routes/vendor.$id.tsx"),
  route("vendor/:id/review", "routes/vendor.$id.review.tsx"),

  // For testing and experimentation
  route("playground", "routes/playground.tsx"),
] satisfies RouteConfig;
