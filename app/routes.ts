import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Landing Page
  index("routes/landingpage.tsx"),
  route("join-waitlist/success", "routes/waitlist_success.tsx"),

  // Authentication
  route("login", "routes/auth/login.tsx"),
  route("register", "routes/auth/register.tsx"),
  route("auth/callback", "routes/auth/auth.callback.tsx"),

  // Onboarding Routes
  route("onboarding/check-email", "routes/onboarding/check-email.tsx"),
  route("onboarding", "routes/onboarding/_layout.tsx", { id: "OnboardingLayout" }, [
    route("role", "routes/onboarding/role.tsx"),
    route("student/profile", "routes/onboarding/student.profile.tsx"),
    route("student/interests", "routes/onboarding/student.interests.tsx"),
    route("vendor/profile", "routes/onboarding/vendor.profile.tsx"),
    route("vendor/store", "routes/onboarding/vendor.store.tsx"),
    route("complete", "routes/onboarding/onboarding.complete.tsx"),
  ]),

  // Marketplace Routes
  route("marketplace", "routes/marketplace/_layout.tsx", {id: "market-layout"}, [
    index("routes/marketplace/index.tsx"),
    route("products", "routes/marketplace/products/_layout.tsx", {id: "products-layout"}, [
      index("routes/marketplace/products/index.tsx"),
      route(":productId", "routes/marketplace/products/$productId.tsx"),
      ])
    ]
  ),

  // Vendor Dashboard Routes
  route("vendor", "routes/vendor/_layout.tsx", {id: "VendorLayout"}, [
    index("routes/vendor/index.tsx"),
    route("products", "routes/vendor/products.tsx"),
    route("products/add", "routes/vendor/product.add.tsx"),
    route("products/:productId/edit", "routes/vendor/product.edit.tsx"),
    route("profile", "routes/vendor/profile.tsx"),
    route("settings", "routes/vendor/settings.tsx"),
  ]),

  // For testing and experimentation
  route("playground", "routes/playground.tsx"),
] satisfies RouteConfig;
