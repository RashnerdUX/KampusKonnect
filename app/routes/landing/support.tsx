import type { Route } from './+types/support';
import Navbar from '~/components/NavBar';
import Footer from '~/components/Footer';
import CTAcard from '~/components/landingpage/CTAcard';
import FAQCard from '~/components/landingpage/FAQCard';
import GuideCard from '~/components/landingpage/GuideCard';

export const meta = () => {
    return [
        { title: "Campex Support | Help Center & Customer Support" },
        { name: "description", content: "Need help? Access Campex support resources, FAQs, and guides for students and vendors." },
    ];
}

const Support = ({}: Route.ComponentProps) => {
  const supportCategories = [
    {
      icon: "👤",
      title: "Student Support",
      description: "Get help with orders, accounts, and shopping on Campex",
      topics: ["Placing Orders", "Payment Issues", "Tracking Orders", "Account Management", "Returns & Refunds"],
    },
    {
      icon: "🏪",
      title: "Vendor Support",
      description: "Resources for vendors to succeed on the platform",
      topics: ["Setting Up Shop", "Managing Inventory", "Processing Orders", "Customer Service", "Analytics & Reports"],
    },
    {
      icon: "🔒",
      title: "Account & Security",
      description: "Keep your account safe and secure",
      topics: ["Password Reset", "Two-Factor Authentication", "Account Recovery", "Privacy Settings", "Data Protection"],
    },
    {
      icon: "💳",
      title: "Payments & Billing",
      description: "Information about payments, billing, and refunds",
      topics: ["Payment Methods", "Invoice History", "Refund Policy", "Payout Schedule", "Billing Issues"],
    },
  ];

  const guides = [
    {
      title: "Getting Started as a Student",
      description: "Learn how to create an account, browse products, and make your first purchase",
      readTime: "5 min read",
    },
    {
      title: "How to Become a Vendor",
      description: "Step-by-step guide to setting up your vendor account and launching your shop",
      readTime: "8 min read",
    },
    {
      title: "Managing Your Orders",
      description: "Everything you need to know about tracking, managing, and receiving orders",
      readTime: "4 min read",
    },
    {
      title: "Payment & Withdrawal Guide",
      description: "Understand how payments work and how to withdraw your earnings",
      readTime: "6 min read",
    },
    {
      title: "Troubleshooting Common Issues",
      description: "Solutions to the most common problems users encounter on Campex",
      readTime: "7 min read",
    },
    {
      title: "Community Guidelines",
      description: "Our policies and guidelines to keep Campex safe and respectful for all users",
      readTime: "10 min read",
    },
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page, enter your email, and follow the instructions sent to your inbox.",
    },
    {
      question: "What payment methods does Campex accept?",
      answer: "We accept credit cards, debit cards, bank transfers, and mobile money payments through our secure payment processor.",
    },
    {
      question: "How long does it take to receive my order?",
      answer: "Most orders are delivered within 24-48 hours depending on your location and the vendor's processing time.",
    },
    {
      question: "Can I cancel my order?",
      answer: "Orders can be cancelled within 2 hours of placement if the vendor hasn't started processing it. Contact support for assistance.",
    },
    {
      question: "What is your refund policy?",
      answer: "We offer full refunds for orders that are not delivered, damaged, or significantly different from the listing. Refunds are processed within 5-7 business days.",
    },
    {
      question: "How do I report a problem with a vendor?",
      answer: "Use the 'Report' feature on the vendor's page or contact our support team with details about the issue.",
    },
    {
      question: "Is my personal information safe?",
      answer: "Yes, we use enterprise-grade encryption and security measures to protect all your personal and payment information.",
    },
    {
      question: "How do I contact support?",
      answer: "You can reach our support team via email at support@campex.com, live chat in the app, or visit our Contact Us page.",
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero section */}
        <section className='bg-gradient-to-b from-background via-muted to-primary/30 py-16 lg:py-24'>
          <div className='max-w-4xl mx-auto px-4 text-center'>
            <h1 className='text-4xl lg:text-6xl font-bold mb-4'>How Can We Help?</h1>
            <p className='text-sm lg:text-xl text-muted-foreground'>Find answers, guides, and support resources</p>
          </div>
        </section>

        {/* Search Section */}
        <section className="max-w-4xl mx-auto px-4 py-12" id='search-support'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search for help articles, guides, and FAQs...'
              className='w-full px-6 py-4 rounded-lg border-2 border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            />
            <button className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors'>
              Search
            </button>
          </div>
        </section>

        {/* Support Categories */}
        <section className="max-w-7xl mx-auto px-4 py-12" id="support-categories">
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {supportCategories.map((category, index) => (
              <div key={index} className='rounded-lg border border-border p-8 hover:shadow-lg transition-shadow'>
                <div className='text-4xl mb-4'>{category.icon}</div>
                <h3 className='text-2xl font-bold mb-2'>{category.title}</h3>
                <p className='text-foreground/80 mb-6'>{category.description}</p>
                <div className='space-y-2'>
                  {category.topics.map((topic, topicIndex) => (
                    <a
                      key={topicIndex}
                      href='#'
                      className='flex items-center text-foreground hover:underline'
                    >
                      <span className='mr-2'>→</span>
                      {topic}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Guides */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className='mb-12'>
            <h2 className='text-4xl font-bold mb-4'>Popular Guides</h2>
            <p className='text-muted-foreground'>Start here with our most helpful articles</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {guides.map((guide, index) => (
                <GuideCard key={index} guide={guide} />
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-4xl mx-auto px-4 py-16" id='faq'>
          <div className='mb-12 text-center'>
            <h2 className='text-4xl font-bold mb-4'>Frequently Asked Questions</h2>
            <p className='text-muted-foreground'>Quick answers to common questions</p>
          </div>

          <div className='space-y-4'>
            {faqs.map((faq, index) => (
              <FAQCard key={index} faq={faq} />
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className='bg-muted rounded-lg p-8 lg:p-12 text-center'>
            <h2 className='text-3xl font-bold mb-4'>Didn't find what you were looking for?</h2>
            <p className='text-muted-foreground mb-8 max-w-2xl mx-auto'>
              Our support team is here to help. Get in touch with us and we'll respond as soon as possible.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a
                href='/contact-us'
                className='bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors'
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <CTAcard />
        </section>
      </main>

      <footer id='footer' className='relative py-6 bg-footer-background text-footer-foreground'>
        <Footer />
      </footer>
    </>
  );
};

export default Support;
