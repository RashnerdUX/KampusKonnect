import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // Landing Page
  index("routes/landing/landingpage.tsx"),
  route("join-waitlist/success", "routes/landing/waitlist_success.tsx"),
  route("about", "routes/landing/about.tsx"),
  route("blog", "routes/landing/blog.tsx"),
  route("contact-us", "routes/landing/contact-us.tsx"),
  route("support", "routes/landing/support.tsx"),

  // Authentication
  route("login", "routes/auth/login.tsx"),
  route("register", "routes/auth/register.tsx"),
  route("auth/callback", "routes/auth/auth.callback.tsx"),
  route("auth/reset-password", "routes/auth/reset-password.tsx"),
  route("auth/update-password", "routes/auth/update-password.tsx"),

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
    
    // Products with layout
    route("products", "routes/marketplace/products/_layout.tsx", {id: "products-layout"}, [
      index("routes/marketplace/products/index.tsx"),
      route(":productId", "routes/marketplace/products/$productId.tsx"),
      route("university/:slug", "routes/marketplace/products/university.$slug.tsx"),
      route("category/:slug", "routes/marketplace/products/category.$slug.tsx"),
      // route("vendor/:slug", "routes/marketplace/products/vendor.$slug.tsx"),
    ]),
    
    // Vendors with layout
    route("vendors", "routes/marketplace/vendors/_layout.tsx", {id: "vendors-layout"}, [
      index("routes/marketplace/vendors/index.tsx"),
      route(":vendorId", "routes/marketplace/vendors/vendor.$id.tsx"),
    ]),

    // Additional marketplace pages
    route("search", "routes/marketplace/mobilesearchpage.tsx"),
    route("profile", "routes/marketplace/profile.tsx"),
    route("profile-edit", "routes/marketplace/profile-edit.tsx"),
    route("wishlist", "routes/marketplace/wishlist.tsx"),
    route("notifications", "routes/marketplace/notifications.tsx"),
    route("orders", "routes/marketplace/orders.tsx"),
    route("reviews", "routes/marketplace/reviews.tsx"),
    route("settings", "routes/marketplace/settings.tsx"),
    route("support", "routes/marketplace/support.tsx"),
    route("vouchers", "routes/marketplace/vouchers.tsx"),
    route("wallet", "routes/marketplace/wallet.tsx"),
  ]),

  // Vendor Dashboard Routes
  route("vendor", "routes/vendor/_layout.tsx", {id: "VendorLayout"}, [
    index("routes/vendor/index.tsx"),
    route("products", "routes/vendor/products.tsx"),
    route("products/add", "routes/vendor/product.add.tsx"),
    route("products/:productId/edit", "routes/vendor/product.edit.tsx"),
    route("profile", "routes/vendor/profile.tsx"),
    route("settings", "routes/vendor/settings.tsx"),
  ]),

  // Legal Pages
  route("legal/terms", "routes/legal/terms.tsx"),
  route("legal/privacy", "routes/legal/privacy.tsx"),
  route("legal/cookies", "routes/legal/cookies.tsx"),
  route("sitemap", "routes/sitemap.tsx"),

  // SEO Optimization
  route("/robots.txt", "routes/seo.robots.txt.tsx"),
  route("/sitemap.xml", "routes/seo.sitemap.xml.tsx"),

  // API Routes
  route("api/search", "routes/api/api.search.tsx"),

  // For testing and experimentation
  route("playground", "routes/admin/playground.tsx"),
  route("test-503", "routes/admin/test-503.tsx"),
] satisfies RouteConfig;
