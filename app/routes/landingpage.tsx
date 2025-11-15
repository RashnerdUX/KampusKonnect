import React from 'react'
import type { Route } from './+types/landingpage';
import { FaArrowRightLong } from "react-icons/fa6";

// Component for the landing page
import Navbar from '~/components/navbar';
import { MailMinus } from 'lucide-react';

export const LandingPage = () => {
  return (
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
              <button className='bg-primary text-primary-foreground font-medium text-base md:text-[16px] px-4 py-2 md:px-[40px] md:py-4 rounded-full transition-colors flex items-center' onClick={() => {window.location.href = '/register'}}>
                Get Started
                <FaArrowRightLong className='inline-block ml-4 text-primary-foreground' />
              </button>
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

      <section id='features' className='pt-16'>
        <div>
          <div className='text-2xl'> Featured Products </div>
        </div>

      </section>
    </main>
  )
}

export default LandingPage;