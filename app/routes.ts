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

  // 
  route("vendor/new", "routes/vendor.new.tsx"),
  route("vendor/:id", "routes/vendor.$id.tsx"),
  route("vendor/:id/review", "routes/vendor.$id.review.tsx"),

  // For testing and experimentation
  route("playground", "routes/playground.tsx"),
] satisfies RouteConfig;
