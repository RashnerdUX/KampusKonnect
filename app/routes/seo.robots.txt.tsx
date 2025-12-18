import React from 'react';
import { data } from 'react-router';
import type { Route } from './+types/seo.robots.txt';

export const loader = async(_args: Route.LoaderArgs) => {
  const baseUrl = process.env.SITE_URL || 'https://www.shopwithcampex.com';

  // Define the robots.txt content
  const robotsTxt = `
    User-agent: Googlebot
    Disallow: /nogooglebot/

    User-agent: *
    Disallow: /private/
    Disallow: /api/
    Allow: /

    Sitemap: ${baseUrl}/sitemap.xml
  `

  return new Response(
    robotsTxt,
    {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400',
      }
    }
  )
};