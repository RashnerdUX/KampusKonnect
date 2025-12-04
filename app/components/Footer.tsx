import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { Link } from 'react-router';
import { DividerLine } from './utility/DividerLine';
import { ThemeToggle } from './ThemeToggle';

export const Footer = () => {

    const socialLinks = [
        { icon: <FaFacebookF />, url: "https://www.facebook.com/campexapp" },
        { icon: <FaTwitter />, url: "https://www.twitter.com/campexapp" },
        { icon: <FaInstagram />, url: "https://www.instagram.com/campexapp" },
        { icon: <FaLinkedinIn />, url: "https://www.linkedin.com/company/campexapp" },
    ];

    const campexLinks = [
        { text: "Home", url: "/" },
        { text: "About Us", url: "/" },
        { text: "Contact", url: "/" },
        { text: "Blog", url: "/" },
    ];

    const studentLinks = [
        { text: "Browse Products", url: "/" },
        { text: "How It Works", url: "/" },
        { text: "Student FAQs", url: "/" },
        { text: "Support", url: "/" },
    ];

    const vendorLinks = [
        { text: "Vendor Sign Up", url: "/" },
        { text: "Vendor FAQs", url: "/" },
        { text: "Pricing", url: "/" },
        { text: "Resources", url: "/" },
    ];

    const legalLinks = [
        { text: "Privacy Policy", url: "/" },
        { text: "Terms of Service", url: "/" },
        { text: "Cookie Policy", url: "/" },
        { text: "Sitemap", url: "/" },
    ];

    const userlinks = [
        { text: "Campex in Your Area", url: "#" },
        { text: "Student Services", url: "#" },
        { text: "Community Highlights", url: "#" },
        { text: "New on Campex", url: "#" },
    ]

  return (
    <div className='relative'>
        <div className='relative w-full mx-auto px-4 sm:px-6 md:px-8 xl:px-24'>
            <div className='relative flex flex-col lg:flex-row items-start justify-between space-y-8 lg:space-y-0 pb-8 pt-4 sm:pt-6 md:pt-8 lg:pt-12'>

                {/* The logo and contact details */}
                <div className='flex flex-col gap-4 md:gap-6 w-full lg:w-auto pb-6 lg:pb-14'>
                    <Link to="/" className=''>
                        <figure className='w-32 h-[80px]'>
                            <img src="/logo/logo-dark.svg" alt="Campex Logo - Light Background" loading='lazy' className='object-cover w-full' />
                        </figure>
                    </Link>
                    <h4 className='text-footer-foreground text-base max-w-full md:max-w-[497px] leading-relaxed md:leading-[30px] text-wrap'> Discover the best vendors on your campus with zero hassle when you shop with Campex </h4>

                    {/* Social Links */}
                    <div className='flex gap-4 md:gap-6 items-start w-full max-w-[200px]'>
                        {socialLinks.map(({ icon, url }, index) => (
                            <div className='rounded-full size-8 bg-footer-link/10 flex items-center justify-center hover:bg-footer-link-hover/20 transition-colors duration-300' key={index}>
                                <a 
                                    key={index} href={url} target="_blank" rel="noopener noreferrer" className='text-footer-foreground hover:text-footer-link-hover transition-colors duration-300'>
                                    {icon}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* The Quick links section */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-[100px] w-full lg:w-auto'>
                    {/* Campex Links */}
                    <div className='flex flex-col gap-4'>
                        <h3 className='font-semibold text-lg mb-2 text-white'> Campex </h3>
                        <div className='flex flex-col gap-2'>
                            {campexLinks.map(({ text, url }, index) => (
                                <Link key={index} to={url} className='text-footer-foreground hover:text-footer-link-hover transition-colors duration-300'>
                                    {text}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* For Students */}
                    <div className='flex flex-col gap-4'>
                        <h3 className='font-semibold text-lg mb-2 text-white'> Students </h3>
                        <div className='flex flex-col gap-2'>
                            {studentLinks.map(({ text, url }, index) => (
                                <Link key={index} to={url} className='text-footer-foreground hover:text-footer-link-hover transition-colors duration-300'>
                                    {text}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* For Vendors */}
                    <div className='flex flex-col gap-4'>
                        <h3 className='font-semibold text-lg mb-2 text-white'> Vendors </h3>
                        <div className='flex flex-col gap-2'>
                            {vendorLinks.map(({ text, url }, index) => (
                                <Link key={index} to={url} className='text-footer-foreground hover:text-footer-link-hover transition-colors duration-300'>
                                    {text}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div className='flex flex-col gap-4'>
                        <h3 className='font-semibold text-lg mb-2 text-white'> Campus </h3>
                        <div className='flex flex-col gap-2'>
                            {userlinks.map(({ text, url }, index) => (
                                <Link key={index} to={url} className='text-footer-foreground hover:text-footer-link-hover transition-colors duration-300'>
                                    {text}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <DividerLine />
            <div className='text-footer-foreground text-sm text-center py-4 md:py-6'>
                <div className='flex flex-col lg:flex-row items-center justify-between'>
                    <div>
                        &copy; {new Date().getFullYear()} Campex. All rights reserved.
                    </div>
                    <div>
                        {legalLinks.map(({ text, url }, index) => (
                            <span key={index}>
                                <Link to={url} className='text-footer-foreground hover:text-footer-link-hover transition-colors duration-300'>
                                    {text}
                                </Link>
                                {index < legalLinks.length - 1 && <span className='mx-2'>|</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Theme toggle fixed to the bottom right */}
            <div className='absolute bottom-2 right-4'>
                <ThemeToggle />
            </div>
        </div>
    </div>
  )
}

export default Footer;
