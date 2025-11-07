import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landingpage.tsx"),
  // The Application Routes
  route("app", "routes/home.tsx"),
  route("login", "routes/auth/login.tsx"),
  route("register", "routes/auth/register.tsx"),
  route("vendor/new", "routes/vendor.new.tsx"),
  route("vendor/:id", "routes/vendor.$id.tsx"),
  route("vendor/:id/review", "routes/vendor.$id.review.tsx"),
] satisfies RouteConfig;
