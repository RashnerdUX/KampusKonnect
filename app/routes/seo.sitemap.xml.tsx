import React from 'react';
import type { Route } from './+types/seo.sitemap.xml';
import { createSupabaseServerClient } from '~/utils/supabase.server';

interface SitemapUrl {
  path: string;
  priority: number;
  changefreq: string;
  lastMod?: string;
}

export const loader = async(_args: Route.LoaderArgs) => {
  const baseUrl = process.env.SITE_URL || 'https://www.shopwithcampex.com';
  console.log("Generating sitemap for base URL:", baseUrl);

  const presentDay = new Date().toISOString();

  const landingPageRoutes: SitemapUrl[] = [
    { path: '/', priority: 1.0, changefreq: 'weekly' },
    { path: '/marketplace', priority: 0.9, changefreq: 'daily' },
    { path: '/about', priority: 0.8, changefreq: 'monthly' },
    { path: '/contact', priority: 0.8, changefreq: 'monthly' },
    { path: '/legal/terms', priority: 0.7, changefreq: 'yearly' },
    { path: '/legal/privacy', priority: 0.7, changefreq: 'yearly' },
    { path: '/legal/cookies', priority: 0.6, changefreq: 'yearly' },
    { path: '/login', priority: 0.5, changefreq: 'monthly'},
    { path: '/register', priority: 0.5, changefreq: 'monthly'},
    { path: '/onboarding/role', priority: 0.5, changefreq: 'monthly' },
    { path: '/onboarding/student/profile', priority: 0.5, changefreq: 'monthly' },
    { path: '/onboarding/vendor/profile', priority: 0.5, changefreq: 'monthly'},
  ]

  // We'll need to define routes for products, categories and university pages
  const request = _args.request;
  const { supabase } = createSupabaseServerClient(request);

  const [ products, categories, universities, vendors ] = await Promise.all([
    supabase.from('store_listings').select('id, updated_at').eq('is_active', true),
    supabase.from('categories').select('slug'),
    supabase.from('universities').select('slug'),
    supabase.from('stores').select('id, updated_at'),
  ]);

  console.log("Fetched dynamic routes data for sitemap.");
  console.log(`Products count: ${products.data?.length || 0}`);
  console.log(`Categories count: ${categories.data?.length || 0}`);
  console.log(`Universities count: ${universities.data?.length || 0}`);
  console.log(`Vendors count: ${vendors.data?.length || 0}`);

  // Map Supabase to the route data
  const dynamicRoutes: SitemapUrl[] = [
    ...(products.data?.map((product) => ({
      path: `/marketplace/products/${product.id}`,
      priority: 0.8,
      changefreq: 'weekly',
      lastMod: product.updated_at,
    })) || []),

    ...(categories.data?.map((category) => ({
      path: `/marketplace/products/category/${category.slug}`,
      priority: 0.7,
      changefreq: 'weekly',
    })) || []),

    ...(universities.data?.map((university) => ({
      path: `/marketplace/products/university/${university.slug}`,
      priority: 0.7,
      changefreq: 'weekly',
    })) || []),

    ...(vendors.data?.map((vendor) => ({
      path: `/marketplace/vendors/${vendor.id}`,
      priority: 0.7,
      changefreq: 'weekly',
      lastMod: vendor.updated_at,
    })) || []),
  ]

  const allRoutes = [...landingPageRoutes, ...dynamicRoutes];

  // Define the sitemap structure
  let sitemap = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes.map((route)=> 
  `
  <url>
  <loc>${baseUrl}${route.path}</loc>
  <lastmod>${route.lastMod || presentDay}</lastmod>
  <changefreq>${route.changefreq}</changefreq>
  <priority>${route.priority}</priority>
  </url>
  `).join('')}
  </urlset>
  `.trim();

  // return the sitemap data
  return new Response(
    sitemap,
    {
      headers: {
        'Content-Type': 'application/xml',
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        encoding: 'UTF-8',
      }
    }
  )
}
