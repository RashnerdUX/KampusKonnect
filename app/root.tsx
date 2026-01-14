import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import NotFound from "./components/error/NotFound";
import ServiceUnavailable from "./components/error/ServiceUnavailable";
import NetworkError from "./components/error/NetworkError";

export const meta: Route.MetaFunction = ({ location }) => {
  const baseUrl = "https://www.shopwithcampex.com";
  const defaultDescription = "Buy and sell items within your university community with Campex Marketplace.";
  
  // This creates a dynamic canonical link for every page automatically
  const canonicalUrl = `${baseUrl}${location.pathname}${location.search}`;

  return [
    // Main Meta Tags
    { title: "Campex | Your Campus Marketplace" },
    { name: "description", content: defaultDescription },
    {
      tagName: "link",
      rel: "canonical",
      href: canonicalUrl,
    },

    // Social Media OG Tags
    // Facebook, WhatsApp, LinkedIn
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Shop With CampEx" },
    { property: "og:title", content: "Shop With CampEx" },
    { property: "og:description", content: defaultDescription },
    { property: "og:image", content: "https://slijaoqgxaewlqthtahj.supabase.co/storage/v1/object/public/assets/logo-green.png" },
    { property: "og:url", content: canonicalUrl },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Shop With CampEx" },
    { name: "twitter:description", content: defaultDescription },
    { name: "twitter:image", content: "https://slijaoqgxaewlqthtahj.supabase.co/storage/v1/object/public/assets/logo-green.png" },

    // Mobile / Branding
    { name: "theme-color", content: "#019b01" },
  ];
};

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Asap+Condensed:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Oswald:wght@200..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
  {
    rel: "manifest",
    href: "/site.webmanifest",
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-foreground">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {

  const isLikelyNetworkError = (err: unknown): boolean => {
    if (!(err instanceof Error)) return false;

    // We'll use the error message to check if the user is offline
    const msg = err.message.toLowerCase();

    return (
      msg.includes("fetch") ||
      msg.includes("network") ||
      msg.includes("offline") ||
      msg.includes("connection") ||
      msg.includes("timeout") ||
      !navigator.onLine
    );
  }

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <NotFound />
      case 503:
        return <ServiceUnavailable />
    
      default:
          return (
          <div className="flex min-h-dvh items-center justify-center p-4 text-center">
            <div>
              <h1 className="text-6xl font-bold">{error.status}</h1>
              <p className="mt-4 text-xl">{error.statusText || "Something went wrong"}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 rounded bg-primary px-6 py-3 text-primary-foreground"
              >
                Retry
              </button>
            </div>
          </div>
        );
    }
  }

  // For unexpected errors
  if (import.meta.env.DEV && error instanceof Error) {
    console.error(error);
  }

  // Check for network errors
  if (isLikelyNetworkError(error)){
    return <NetworkError onRetry={()=> window.location.reload()} />
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold text-destructive">Oops!</h1>
        <p className="mt-4 text-lg">Something broke on our end.</p>
        <p className="mt-2 text-muted-foreground">Our team has been notified.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 rounded-lg bg-primary px-6 py-3 text-primary-foreground"
        >
          Reload page
        </button>
      </div>
    </div>
  );
}
