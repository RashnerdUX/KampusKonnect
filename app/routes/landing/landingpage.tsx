import React, {useEffect} from 'react'
import type { Route } from './+types/landingpage';
import { FaArrowRightLong } from "react-icons/fa6";
import { Form, useNavigate } from 'react-router';

// Component for the landing page
import Navbar from '~/components/NavBar';
import WaitlistSuccessCard from '~/components/WaitlistSuccessCard';
import Footer from '~/components/Footer';
import BenefitCard from '~/components/landingpage/BenefitCard';
import { VendorCardIllustration } from '~/components/illustrations/VendorIllustration';
import FeaturesSection from '~/components/landingpage/FeatureCard';
import ReviewsCardSection from '~/components/landingpage/ReviewsCard';

export const meta = (_args: Route.MetaArgs) => {
  return [
    { title: "Campex - Your Campus Marketplace" },
    { name: "description", content: "Shop smarter with Campex. Discover the best campus deals and connect with trusted vendors on Campex, your ultimate marketplace for student essentials." },
    { name: "keywords", content: "campus marketplace, student deals, vendor connections, student essentials, campus shopping, student discounts, trusted vendors" },
  ]
}

export const action = async ({ request, }: Route.ActionArgs) => {
  // TODO: Implement rate limiting to prevent abuse

    const formData = await request.formData();
    const userEmail = formData.get("email");
    if (typeof userEmail !== "string" || userEmail.length === 0) {
      return { error: "Email is required.", success: false };
    }

    // Send email to Brevo API
    try {
        if (!process.env.BREVO_API_KEY || !process.env.BREVO_LIST_ID) {
            return { error: "Missing environment variables.", success: false };
        }

        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": `${process.env.BREVO_API_KEY}`
            },
            body: JSON.stringify({
                email: userEmail,
                listIds: [Number(process.env.BREVO_LIST_ID)],
                updateEnabled: false
            })
        });

        if (!response.ok) {
            const responseJson = await response.json();

            // If the user is already on the list, treat it as a success and inform them
            if (responseJson.code === "duplicate_parameter") {
                return { message: "You are already on the waitlist! Sit back and we'll be in touch", success: true };
            }

            console.error("Brevo API response:", responseJson);
            return { error: "Failed to join the waitlist. Please try again later.", success: false };
        }
    } catch (err) {
        console.error("Error contacting Brevo API:", err);
        return { error: "Failed to join the waitlist. Please try again later.", success: false };
    }

    return { message: "Successfully joined the waitlist!", success: true };
}

export const LandingPage = ({actionData}: Route.ComponentProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.success){
      requestAnimationFrame(() => {
        document.getElementById("waitlist")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, []);

  return (
    <>
    {/* Main Content */}
      <main>
        {/* Nav bar */}
        <Navbar />

        <section id='hero' className='relative pt-2 min-h-[55vh] lg:min-h-[70vh] bg-gradient-to-b from-background via-muted to-primary/30 overflow-visible pb-16 -mb-16'>
          <div className='flex flex-col lg:flex-row'>
            {/* Hero Content */}
            <div className='px-6 sm:px-8 md:px-12 lg:px-[96.96px] flex flex-col h-full justify-center items-start space-y-6 lg:space-y-8 my-4 lg:my-20 sm:my-6'>
              <div className='max-w-full lg:max-w-[646px]'>
                <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold leading-tight sm:leading-[1.1] lg:leading-[60px] uppercase font-display'>Shop smarter with Campex</h1>
              </div>
              <div className='max-w-full lg:max-w-[546px]'>
                <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/70'>Discover the best campus deals and connect with trusted vendors on Campex, your ultimate marketplace for student essentials.</p>
              </div>
              <div>
                <a className='bg-primary text-primary-foreground font-medium text-base md:text-[16px] px-4 py-2 md:px-[40px] md:py-4 rounded-full transition-colors flex items-center' href='/register'>
                  Explore Marketplace
                  <FaArrowRightLong className='inline-block ml-4 text-primary-foreground' />
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className='mt-12 lg:mt-0 lg:ml-12 flex-1 flex justify-center px-6 sm:px-8 md:px-12 lg:px-0'>
              <div className='relative flex w-full h-100 sm:h-80 lg:w-[480px] lg:h-[70vh]'>
                <div className='bg-primary/80 translate-x-2 translate-y-2 rounded-3xl inset-0 absolute'></div>
                <div className='bg-[url(/images/heroimage.png)] bg-cover bg-center w-full h-full relative rounded-3xl z-10'></div>

                {/* 3d icons */}

              </div>
            </div>
          </div>

        </section>

        <section id='benefits' className='hidden relative mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-[102px] my-12 sm:my-16 md:my-20 rounded-2xl overflow-hidden'>
          <div className='relative'>
            <div className='mb-4 sm:mb-6 md:mb-8 flex flex-col text-center items-center space-x-4'>
              {/* Badge */}
              <div className='inline-block'>
                <div className='section-badge'>
                  Benefits
                </div>
              </div>

              {/* Section title and subtext */}
              <h1 className='section-title'> Why Choose Campex? </h1>
              <p className='section-paragraph'> Campex is designed with students in mind, offering a seamless and secure platform to buy and sell campus essentials. Here’s why you should choose us: </p>
            </div>

            {/* Benefit Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mt-8 sm:mt-10 md:mt-12'>
              <BenefitCard
                title="Faster Campus Deals"
                subtext="Compare vendors, chat instantly, and place orders without leaving the app."
                SvgIllustration={VendorCardIllustration}
              />
            </div>

          </div>

        </section>

        <section id='features' className='relative mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-[102px] my-12 sm:my-16 md:my-20 rounded-2xl overflow-hidden py-4 lg:py-8'>
          <div className='relative'>
            <div className='mb-4 sm:mb-6 md:mb-8 flex flex-col text-center items-center space-x-4'>
              {/* Badge */}
              <div className='inline-block'>
                <div className='section-badge'>
                  Key Features
                </div>
              </div>

              {/* Section title and subtext */}
              <h1 className='section-title'> How Campex Works </h1>
              <p className='section-paragraph'> Here's how Campex simplifies the process of finding vendors around you on campus. </p>
            </div>

            <FeaturesSection />
          </div>

        </section>

        <section id='reviews' className='relative mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-[102px] my-12 sm:my-16 md:my-20 rounded-2xl overflow-hidden py-4 lg:py-8'>
          <div className='relative'>
            {/* Header */}
            <div className='mb-4 sm:mb-6 md:mb-8 flex flex-col text-center items-center space-x-4'>
              {/* Badge */}
              <div className='inline-block'>
                <div className='section-badge'>
                  Experience
                </div>
              </div>

              {/* Section title and subtext */}
              <h1 className='section-title'> What Students Are Saying </h1>
              <p className='section-paragraph'> Here's what early users of Campex have to say about their experience. </p>
            </div>

            <ReviewsCardSection />
          </div>
        </section>

        <section id="waitlist" className='relative mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-[102px] my-12 sm:my-16 md:my-20 rounded-2xl overflow-hidden'>

          {/* Main container */}
          <div className='relative overflow-hidden backdrop-blur-sm rounded-2xl sm:rounded-3xl md:rounded-4xl py-12 sm:py-14 md:py-16 lg:py-28 px-6 sm:px-8 md:px-12 lg:px-16 bg-gradient-to-b from-footer-background/80 to-footer-background'>

            {/* Background Image */}
            <img src="null" alt="" className='absolute inset-0 w-full h-full object-cover object-center opacity-20 sm:opacity-30 md:opacity-50 -z-10 bg-transparent' />

            {/* Actual content */}
            { actionData?.success ? (
              <div className='relative'>
                <div className='flex flex-col'>
                  <WaitlistSuccessCard />
                </div>
              </div>
            ) : (<div className='relative mx-auto max-w-xl sm:max-w-2xl md:max-w-3xl space-y-6 sm:space-y-7 md:space-y-8 text-center'>
              <div className='inline-block'>
                <div className='bg-primary/20 rounded-full px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 inline-flex items-center space-x-2'>
                  <span className='text-primary text-base sm:text-lg md:text-xl font-medium'> Waitlist </span>
                </div>
              </div>
              <h2 className='font-display text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight'> Join Our Waitlist Today! </h2>
              <p className='text-footer-foreground'> We’re building Nigeria’s first student + vendor marketplace.
                  Join the waitlist and be the first to connect, sell, and grow when we launch. </p>

              <Form method='post' preventScrollReset className='max-w-full sm:max-w-lg md:max-w-2xl mx-auto mt-6 sm:mt-8 md:mt-10 transition-all duration-200 ease-in-out'>
                {/* Swap the container once the user succeeds */}
                  <div className='relative'>
                  {actionData?.error && (<p className='text-red-500 text-sm'>{actionData.error}</p>) }
                  <input type="email" name='email' placeholder='Enter your email address' required className='rounded-full w-full h-12 sm:h-13 md:h-14 lg:h-16 pl-4 sm:pl-5 md:pl-6 pr-28 text-footer-foreground border-2 border-footer-foreground/80 focus:outline-none focus:ring-2 focus:ring-footer-foreground focus:border-transparent transition-all duration-200 ease-in-out'/>
                  <div className='absolute right-1 top-1/2 transform -translate-y-1/2'>
                    <button type='submit' className='bg-primary text-primary-foreground font-medium text-base md:text-[16px] px-4 py-2 md:px-[40px] md:py-4 rounded-full transition-colors flex items-center'>
                      Join Waitlist
                    </button>
                  </div>
                </div>
              </Form>
            </div>)}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id='footer' className='relative py-6 bg-footer-background text-footer-foreground'>
        <Footer />
      </footer>
    </>
  )
}

export default LandingPage;