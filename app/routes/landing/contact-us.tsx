import type { Route } from './+types/contact-us';
import Navbar from '~/components/NavBar';
import Footer from '~/components/Footer';
import CTAcard from '~/components/landingpage/CTAcard';
import { useState } from 'react';
import { useNavigation, Form } from 'react-router';
import ContactMethodCard from '~/components/landingpage/ContactMethodCard';
import { ButtonSpinner } from '~/components/ButtonSpinner';

export const meta = () => {
    return [
        { title: "Contact Campex | Get in Touch with Our Team" },
        { name: "description", content: "Have questions? Contact the Campex team. We're here to help students and vendors connect and succeed." },
    ];
}

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return { error: "Method not allowed", success: false };
  }

  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  // Basic validation
  if (!name || !email || !subject || !message) {
    return { error: "All fields are required", success: false };
  }

  // TODO: Implement email sending with your email service (Brevo, SendGrid, etc.)
  console.log("Contact form submission:", { name, email, subject, message });

  return { message: "Thank you for your message! We'll get back to you soon.", success: true };
};

const ContactUs = ({ actionData }: Route.ComponentProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigation = useNavigation();
  if (navigation.state === "submitting" && !isSubmitting) {
    setIsSubmitting(true);
  } else if (navigation.state === "idle" && isSubmitting) {
    setIsSubmitting(false);
  }

  const contactMethods = [
    {
      icon: "📧",
      title: "Email",
      description: "Send us an email and we'll respond within 24 hours",
      value: "info@shopwithcampex.com",
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Chat with our support team in real-time via WhatsApp",
      value: "Available 9AM - 6PM WAT",
    },
    {
      icon: "📱",
      title: "Phone",
      description: "Call us/Chat with us for immediate assistance",
      value: "+2347037015226",
    },
    {
      icon: "📍",
      title: "Office",
      description: "Visit us at our headquarters",
      value: "Lagos, Nigeria",
    },
  ];

  const faqs = [
    {
      question: "How do I become a vendor on Campex?",
      answer: "Visit our vendor sign-up page and fill out the onboarding form. Our team will review your application and get back to you within 48 hours.",
    },
    {
      question: "What if I'm having issues with an order?",
      answer: "Contact our support team directly through the app or email us at support@campex.com with your order details.",
    },
    {
      question: "How long does delivery take?",
      answer: "Most orders are delivered within 24-48 hours depending on your location and the vendor.",
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes, we use industry-leading encryption and security measures to protect all payment information.",
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero section */}
        <section className='bg-gradient-to-b from-background via-muted to-primary/30 py-16 lg:py-24'>
          <div className='max-w-4xl mx-auto px-4 text-center'>
            <h1 className='text-4xl lg:text-6xl font-bold mb-4'>Get in Touch</h1>
            <p className='text-sm lg:text-xl text-muted-foreground'>We'd love to hear from you. Send us a message!</p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="max-w-7xl mx-auto px-4 pt-16 pb-6 lg:py-16">
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
            {contactMethods.map((method, index) => (
                <ContactMethodCard key={index} method={method} />
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="max-w-4xl mx-auto px-4 py-6 lg:py-10">
          <div className='bg-muted rounded-lg p-8 lg:p-12'>
            <h2 className='text-3xl font-bold mb-8'>Send us a Message</h2>

            {actionData?.success ? (
              <div className='bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg'>
                <p className='font-medium'>{actionData.message}</p>
              </div>
            ) : (
              <Form method='post' className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>Full Name</label>
                    <input
                      type='text'
                      name='name'
                      className='w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-2'>Email Address</label>
                    <input
                      type='email'
                      name='email'
                      className='w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2'>Subject</label>
                  <input
                    type='text'
                    name='subject'
                    className='w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2'>Message</label>
                  <textarea
                    name='message'
                    rows={6}
                    className='w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none'
                    required
                  />
                </div>

                {actionData?.error && (
                  <div className='bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg'>
                    <p className='text-sm'>{actionData.error}</p>
                  </div>
                )}

                <button
                  type='submit'
                  className='w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <div>
                    <ButtonSpinner /> Sending...
                  </div> : "Send Message"}
                </button>
              </Form>
            )}
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>Frequently Asked Questions</h2>
            <p className='text-muted-foreground'>Find answers to common questions below</p>
          </div>

          <div className='space-y-4'>
            {faqs.map((faq, index) => (
              <details key={index} className='group border border-border rounded-lg p-6 cursor-pointer'>
                <summary className='font-medium flex items-center justify-between hover:text-primary transition-colors'>
                  {faq.question}
                  <span className='group-open:rotate-180 transition-transform'>▼</span>
                </summary>
                <p className='text-muted-foreground mt-4 pt-4 border-t border-border'>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 pt-10 pb-16">
          <CTAcard />
        </section>
      </main>

      <footer id='footer' className='relative py-6 bg-footer-background text-footer-foreground'>
        <Footer />
      </footer>
    </>
  );
};

export default ContactUs;