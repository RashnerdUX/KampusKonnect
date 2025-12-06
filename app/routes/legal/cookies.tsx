import React from 'react';
import type { Route } from './+types/cookies';
import Navbar from '~/components/navbar';
import Footer from '~/components/Footer';

export const meta = (_args: Route.MetaArgs) => {
  return [
    { title: "Cookie Policy - Campex" },
    { name: "description", content: "Learn about how Campex uses cookies and similar tracking technologies." },
  ];
};

export default function CookiePage() {
  return (
    <>
      <main>
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background via-muted to-primary/30 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display uppercase text-center">
              Cookie Policy
            </h1>
            <p className="text-lg text-foreground/70 text-center mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12">
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              
              {/* Introduction */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are placed on your device when you visit a website. 
                  They are widely used to make websites work more efficiently and provide information to 
                  the website owners. Cookies help us enhance your experience on Campex by remembering 
                  your preferences and understanding how you use our platform.
                </p>
              </div>

              {/* Types of Cookies */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">2. Types of Cookies We Use</h2>
                <div className="text-muted-foreground leading-relaxed space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                    <p>
                      These cookies are necessary for the website to function properly. They enable core 
                      functionality such as security, network management, and account authentication. 
                      You cannot opt out of these cookies.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Performance Cookies</h3>
                    <p>
                      These cookies collect information about how you use our website, such as which pages 
                      you visit most often and any error messages you receive. This data helps us improve 
                      how our website works.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Functionality Cookies</h3>
                    <p>
                      These cookies remember choices you make (such as your language preference, region, 
                      or display settings) to provide a more personalized experience.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Targeting/Advertising Cookies</h3>
                    <p>
                      These cookies are used to deliver advertisements more relevant to you and your interests. 
                      They may also be used to limit the number of times you see an advertisement and measure 
                      the effectiveness of advertising campaigns.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookies We Use */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">3. Specific Cookies We Use</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-muted-foreground text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 pr-4 font-semibold text-foreground">Cookie Name</th>
                        <th className="text-left py-3 pr-4 font-semibold text-foreground">Purpose</th>
                        <th className="text-left py-3 font-semibold text-foreground">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-3 pr-4">sb-*-auth-token</td>
                        <td className="py-3 pr-4">User authentication</td>
                        <td className="py-3">Session</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 pr-4">theme</td>
                        <td className="py-3 pr-4">Theme preference (light/dark)</td>
                        <td className="py-3">1 year</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 pr-4">_ga</td>
                        <td className="py-3 pr-4">Google Analytics tracking</td>
                        <td className="py-3">2 years</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 pr-4">_gid</td>
                        <td className="py-3 pr-4">Google Analytics session</td>
                        <td className="py-3">24 hours</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4">cart</td>
                        <td className="py-3 pr-4">Shopping cart contents</td>
                        <td className="py-3">7 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Third-Party Cookies */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may use third-party services that place cookies on your device, including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
                  <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                  <li><strong>Payment Providers:</strong> For secure payment processing</li>
                  <li><strong>Social Media Platforms:</strong> For social sharing features</li>
                  <li><strong>Customer Support Tools:</strong> For chat and support functionality</li>
                </ul>
              </div>

              {/* Managing Cookies */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">5. Managing Your Cookie Preferences</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                  <p>
                    Most web browsers allow you to control cookies through their settings. You can typically 
                    find these settings in the "Options" or "Preferences" menu of your browser.
                  </p>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Browser Settings</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Chrome: Settings → Privacy and Security → Cookies</li>
                      <li>Firefox: Options → Privacy & Security → Cookies</li>
                      <li>Safari: Preferences → Privacy → Cookies</li>
                      <li>Edge: Settings → Privacy & Security → Cookies</li>
                    </ul>
                  </div>
                  <p>
                    Please note that blocking or deleting cookies may impact your experience on our platform, 
                    as some features may not function properly.
                  </p>
                </div>
              </div>

              {/* Do Not Track */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">6. Do Not Track Signals</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Some browsers have a "Do Not Track" feature that signals to websites that you do not want 
                  to be tracked. Currently, there is no industry standard for how websites should respond to 
                  these signals. We do not currently respond to Do Not Track signals.
                </p>
              </div>

              {/* Updates */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">7. Updates to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in technology, 
                  legislation, or our data practices. Any changes will be posted on this page with an 
                  updated revision date.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about our use of cookies, please contact us at:
                </p>
                <p className="text-primary font-medium mt-2">
                  privacy@campex.ng
                </p>
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
