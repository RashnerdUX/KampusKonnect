import React from 'react';
import type { Route } from './+types/sitemap';
import { Link } from 'react-router';
import Navbar from '~/components/NavBar';
import Footer from '~/components/Footer';
import { ChevronRight, Home, ShoppingBag, Store, User, FileText, Shield, Cookie, Map, LogIn, UserPlus, Settings, HelpCircle } from 'lucide-react';

export const meta = (_args: Route.MetaArgs) => {
  return [
    { title: "Sitemap - Campex" },
    { name: "description", content: "Navigate all pages on Campex - your campus marketplace platform." },
  ];
};

interface SitemapLink {
  text: string;
  url: string;
  icon?: React.ReactNode;
}

interface SitemapSection {
  title: string;
  description: string;
  links: SitemapLink[];
}

export default function SitemapPage() {
  const sitemapSections: SitemapSection[] = [
    {
      title: "Main Pages",
      description: "Core pages of the Campex platform",
      links: [
        { text: "Home", url: "/", icon: <Home className="w-4 h-4" /> },
        { text: "Marketplace", url: "/marketplace", icon: <ShoppingBag className="w-4 h-4" /> },
        { text: "About Us", url: "/about", icon: <HelpCircle className="w-4 h-4" /> },
        { text: "Blog", url: "/blog", icon: <FileText className="w-4 h-4" /> },
      ]
    },
    {
      title: "Marketplace",
      description: "Browse products and vendors",
      links: [
        { text: "All Products", url: "/marketplace/products", icon: <ShoppingBag className="w-4 h-4" /> },
        { text: "All Vendors", url: "/marketplace/vendors", icon: <Store className="w-4 h-4" /> },
      ]
    },
    {
      title: "Account",
      description: "User authentication and account management",
      links: [
        { text: "Log In", url: "/login", icon: <LogIn className="w-4 h-4" /> },
        { text: "Register", url: "/register", icon: <UserPlus className="w-4 h-4" /> },
        { text: "Reset Password", url: "/auth/reset-password", icon: <Settings className="w-4 h-4" /> },
      ]
    },
    {
      title: "Vendor Portal",
      description: "For vendors to manage their stores",
      links: [
        { text: "Vendor Dashboard", url: "/vendor", icon: <Store className="w-4 h-4" /> },
        { text: "Become a Vendor", url: "/onboarding", icon: <UserPlus className="w-4 h-4" /> },
      ]
    },
    {
      title: "Legal",
      description: "Legal documents and policies",
      links: [
        { text: "Terms and Conditions", url: "/legal/terms", icon: <FileText className="w-4 h-4" /> },
        { text: "Privacy Policy", url: "/legal/privacy", icon: <Shield className="w-4 h-4" /> },
        { text: "Cookie Policy", url: "/legal/cookies", icon: <Cookie className="w-4 h-4" /> },
        { text: "Sitemap", url: "/sitemap", icon: <Map className="w-4 h-4" /> },
      ]
    },
  ];

  return (
    <>
      <main>
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background via-muted to-primary/30 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display uppercase text-center">
              Sitemap
            </h1>
            <p className="text-lg text-foreground/70 text-center mt-4">
              Find all pages on Campex in one place
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 lg:py-16">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sitemapSections.map((section, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-bold mb-2">{section.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link 
                          to={link.url}
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                        >
                          {link.icon}
                          <span className="flex-1">{link.text}</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-12 bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
              <h2 className="text-xl font-bold mb-4">Need Help Finding Something?</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you can't find what you're looking for, try using the search feature in our 
                marketplace or contact our support team. We're here to help you navigate the 
                Campex platform and find exactly what you need.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link 
                  to="/marketplace"
                  className="bg-primary text-primary-foreground font-medium text-base px-6 py-3 rounded-full transition-colors hover:bg-primary/90"
                >
                  Browse Marketplace
                </Link>
                <Link 
                  to="/"
                  className="bg-transparent border-2 border-foreground text-foreground font-medium text-base px-6 py-3 rounded-full transition-colors hover:bg-foreground/10"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="relative py-6 bg-footer-background text-footer-foreground">
        <Footer />
      </footer>
    </>
  );
}
