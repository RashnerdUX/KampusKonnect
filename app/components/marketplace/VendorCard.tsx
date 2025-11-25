import React, { useState } from 'react'
import { FaCircleCheck, FaWhatsapp, FaStar } from "react-icons/fa6";
import { PiDotOutlineFill } from "react-icons/pi";

export interface VendorCardProps {
    id: string;
    name: string;
    tagline: string;
    description?: string
    location?: string;
    logoUrl?: string;
    coverUrl?: string;
    rating: number;
    reviewCount?: number;
    category: string;
    verified: boolean;
}

export const VendorCard = ({name, tagline, description, logoUrl, rating, reviewCount, category, verified}: VendorCardProps) => {
  const placeholder = '/images/vendor-placeholder.png'
  const [logoSrc, setLogoSrc] = useState(logoUrl && logoUrl.trim() !== '' ? logoUrl : placeholder)

  return (
    <div className='flex flex-col gap-4 p-4 bg-card rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300'>
        <div className='flex justify-center items-center relative size-18 mx-auto border border-border rounded-full bg-none'>
            <div className='relative h-16 w-16 mx-auto rounded-full bg-gray-100'>
                <img
                src={logoSrc}
                alt={`${name} logo`}
                className='h-full w-full object-cover rounded-full'
                onError={() => setLogoSrc(placeholder)}
                loading='lazy'
                />
                {/* Verified badge */}
                {verified && (
                    <div className='absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-1 border border-border'>
                        <FaCircleCheck className='text-primary size-4' title='Verified Vendor' />
                    </div>
                )}
            </div>
        </div>
        <div className='flex flex-col gap-2 flex-grow items-center'>
            <div className='flex flex-col items-center'>
                <h3 className='text-lg font-semibold text-foreground'>{name}</h3>
                <p className='text-sm text-foreground/80 flex-grow'>{tagline}</p>
                <div className='flex justify-between items-center mt-2'>
                    <span className='text-sm text-foreground/70'> UNILORIN </span>
                    <PiDotOutlineFill className='mx-0.5 text-foreground/50' size={8} />
                    <span className='text-sm text-foreground/70'> 
                        {category}
                    </span>
                    <PiDotOutlineFill className='mx-0.5 text-foreground/50' size={8} />
                    <span className='text-sm font-medium text-foreground align-center flex items-baseline-last'> 
                        {rating.toFixed(1)}
                    </span>
                </div>
            </div>
            <button type="button" className='flex items-center gap-2 py-2 px-4 rounded-full bg-[#25D366] text-white w-full justify-center hover:bg-[#1ebe5d] transition-colors'>
                <FaWhatsapp /> Contact Vendor 
            </button>
        </div>
    </div>
  )
}
