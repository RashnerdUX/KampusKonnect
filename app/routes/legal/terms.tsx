import React from 'react';
import type { Route } from './+types/terms';
import Navbar from '~/components/NavBar';
import Footer from '~/components/Footer';

export const meta = (_args: Route.MetaArgs) => {
  return [
    { title: "Terms and Conditions - Campex" },
    { name: "description", content: "Read the Terms and Conditions for using Campex, the campus marketplace platform." },
  ];
};

export default function TermsPage() {
  return (
    <>
      <main>
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background via-muted to-primary/30 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display uppercase text-center">
              Terms and Conditions
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
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to Campex! These Terms and Conditions govern your use of the Campex platform, 
                  including our website and mobile applications. By accessing or using Campex, you agree 
                  to be bound by these terms. If you do not agree with any part of these terms, please 
                  do not use our services.
                </p>
              </div>

              {/* Definitions */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">2. Definitions</h2>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
                  <li><strong>"Platform"</strong> refers to the Campex website and mobile applications.</li>
                  <li><strong>"User"</strong> refers to any individual who accesses or uses the Platform.</li>
                  <li><strong>"Student"</strong> refers to a User who browses and purchases products on the Platform.</li>
                  <li><strong>"Vendor"</strong> refers to a User who lists and sells products on the Platform.</li>
                  <li><strong>"Services"</strong> refers to all services provided by Campex through the Platform.</li>
                </ul>
              </div>

              {/* Eligibility */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">3. Eligibility</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To use Campex, you must be at least 18 years old or have parental consent. You must be 
                  enrolled in or affiliated with a recognized educational institution. You must provide 
                  accurate and complete information during registration and keep this information updated.
                </p>
              </div>

              {/* User Accounts */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">4. User Accounts</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                  <p>
                    You are responsible for maintaining the confidentiality of your account credentials. 
                    You agree to notify us immediately of any unauthorized access to or use of your account.
                  </p>
                  <p>
                    Campex reserves the right to suspend or terminate accounts that violate these terms, 
                    engage in fraudulent activity, or pose a risk to other users or the platform.
                  </p>
                </div>
              </div>

              {/* Vendor Terms */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">5. Vendor Terms</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                  <p>
                    Vendors must provide accurate descriptions and images of their products. Vendors are 
                    responsible for fulfilling orders in a timely manner and maintaining quality standards.
                  </p>
                  <p>
                    Campex reserves the right to remove listings that violate our policies, including 
                    but not limited to: counterfeit goods, prohibited items, or misleading product information.
                  </p>
                  <p>
                    Vendors agree to pay applicable fees and commissions as outlined in the vendor agreement.
                  </p>
                </div>
              </div>

              {/* Prohibited Activities */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">6. Prohibited Activities</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Users are prohibited from:
                </p>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
                  <li>Posting false, misleading, or fraudulent content</li>
                  <li>Harassing, threatening, or intimidating other users</li>
                  <li>Selling prohibited or illegal items</li>
                  <li>Attempting to circumvent platform security measures</li>
                  <li>Creating multiple accounts to evade bans or restrictions</li>
                  <li>Scraping or collecting user data without authorization</li>
                </ul>
              </div>

              {/* Payments and Transactions */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">7. Payments and Transactions</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All transactions on Campex are processed through secure payment partners. Campex is not 
                  responsible for disputes between buyers and sellers, though we will make reasonable 
                  efforts to facilitate resolution. Refund policies are determined by individual vendors 
                  unless otherwise specified.
                </p>
              </div>

              {/* Intellectual Property */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on the Campex platform, including logos, designs, text, and graphics, is 
                  the property of Campex or its licensors and is protected by intellectual property laws. 
                  Users may not copy, modify, or distribute this content without prior written consent.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Campex provides the platform "as is" without warranties of any kind. We are not liable 
                  for any indirect, incidental, or consequential damages arising from your use of the 
                  platform. Our total liability is limited to the amount you have paid to Campex in the 
                  past twelve months.
                </p>
              </div>

              {/* Changes to Terms */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">10. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Campex reserves the right to modify these Terms and Conditions at any time. We will 
                  notify users of significant changes via email or platform notifications. Your continued 
                  use of the platform after changes are made constitutes acceptance of the new terms.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <p className="text-primary font-medium mt-2">
                  <a href="mailto:info@shopwithcampex.com" target="_blank">info@shopwithcampex.com</a>
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
