import React from 'react';
import type { Route } from './+types/privacy';
import Navbar from '~/components/navbar';
import Footer from '~/components/Footer';

export const meta = (_args: Route.MetaArgs) => {
  return [
    { title: "Privacy Policy - Campex" },
    { name: "description", content: "Learn about how Campex collects, uses, and protects your personal information." },
  ];
};

export default function PrivacyPage() {
  return (
    <>
      <main>
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background via-muted to-primary/30 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display uppercase text-center">
              Privacy Policy
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
                  At Campex, we take your privacy seriously. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you use our platform. Please read 
                  this policy carefully to understand our views and practices regarding your personal data.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Name and email address</li>
                      <li>Phone number and delivery address</li>
                      <li>University/institution affiliation</li>
                      <li>Profile picture and account preferences</li>
                      <li>Payment information (processed securely by payment partners)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Automatically Collected Information</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Device information (type, operating system, browser)</li>
                      <li>IP address and location data</li>
                      <li>Usage data (pages visited, time spent, interactions)</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use Your Information */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Personalize your experience and provide recommendations</li>
                  <li>Communicate with you about products, services, and promotions</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Detect, prevent, and address fraud and security issues</li>
                  <li>Comply with legal obligations and enforce our terms</li>
                </ul>
              </div>

              {/* Information Sharing */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">4. Information Sharing</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may share your information with:
                </p>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
                  <li><strong>Vendors:</strong> To facilitate transactions and order fulfillment</li>
                  <li><strong>Service Providers:</strong> Who assist us in operating our platform</li>
                  <li><strong>Payment Processors:</strong> To process secure payments</li>
                  <li><strong>Legal Authorities:</strong> When required by law or to protect rights</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </div>

              {/* Data Security */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. This 
                  includes encryption, secure server infrastructure, and regular security assessments. 
                  However, no method of transmission over the internet is 100% secure.
                </p>
              </div>

              {/* Data Retention */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information for as long as your account is active or as needed 
                  to provide you services. We will also retain and use your information to comply with 
                  legal obligations, resolve disputes, and enforce our agreements. You may request deletion 
                  of your account and associated data at any time.
                </p>
              </div>

              {/* Your Rights */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Restriction:</strong> Request limitation of processing</li>
                  <li><strong>Portability:</strong> Request transfer of your data</li>
                  <li><strong>Objection:</strong> Object to processing of your data</li>
                </ul>
              </div>

              {/* Children's Privacy */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Campex is not intended for children under the age of 13. We do not knowingly collect 
                  personal information from children under 13. If you become aware that a child has 
                  provided us with personal information, please contact us immediately.
                </p>
              </div>

              {/* Third-Party Links */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">9. Third-Party Links</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our platform may contain links to third-party websites. We are not responsible for 
                  the privacy practices of these websites. We encourage you to read the privacy policies 
                  of any third-party sites you visit.
                </p>
              </div>

              {/* Changes to Policy */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new policy on this page and updating the "Last updated" date. You are 
                  advised to review this policy periodically.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
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
