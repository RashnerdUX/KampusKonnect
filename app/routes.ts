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
  route("marketplace", "routes/marketplace/_layout.tsx", {id: "market-layout"}, [
    index("routes/marketplace/index.tsx"),
    route("products", "routes/marketplace/products/_layout.tsx", {id: "products-layout"}, [
      index("routes/marketplace/products/index.tsx"),
      route(":productId", "routes/marketplace/products/$productId.tsx"),
      ])
    ]
  ),

  // Vendor Routes
  route("vendor/new", "routes/vendor.new.tsx"),
  route("vendor/:id", "routes/vendor.$id.tsx"),
  route("vendor/:id/review", "routes/vendor.$id.review.tsx"),

  // For testing and experimentation
  route("playground", "routes/playground.tsx"),
] satisfies RouteConfig;
