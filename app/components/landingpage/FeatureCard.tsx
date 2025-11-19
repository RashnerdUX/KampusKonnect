import React from 'react'

import { FaUniversity, FaSearch, FaWhatsapp, FaShoppingBag } from "react-icons/fa";
import { FaMobileScreen } from "react-icons/fa6";
import { MdVerifiedUser } from "react-icons/md";

interface FeatureCardProps {
  /** Primary headline for the feature */
  title: string
  supportingText: string
  /** Icon representing the feature */
  icon: React.ReactNode
}

const campexFeatures = [
    {
        title: "Campus Selector",
        supportingText: "Pick your school to see only vendors near your hostel, faculty, or campus center. Your campus, your options.",
        icon: <FaUniversity size={24} />
    },
    {
        title: "Smart Search",
        supportingText: "Find any vendor, service, or product in seconds with our campus-tailored search. Quick and easy.",
        icon: <FaSearch size={24} />
    },
    {
        title: "Verified Vendors",
        supportingText: "Every vendor goes through our verification process. Browse with confidence knowing they're legit",
        icon: <MdVerifiedUser size={24} />
    },
    {
        title: "One Tap Connect",
        supportingText: "See what you need? Tap \"Chat on WhatsApp\" and connect instantly. No middleman, no hassle.",
        icon: <FaWhatsapp size={24} />
    },
    {
        title: "Student Vendor Highlight",
        supportingText: "Discover and support student-run businesses on campus. Find unique products and services made by your peers.",
        icon: <FaShoppingBag size={24}  />
    },
    {
        title: "Mobile-First, No App Needed",
        supportingText: "Works perfectly on your phone's browser. No download, no storage space — just open and browse.",
        icon: <FaMobileScreen size={24} />
    }
]

export const FeatureCard = ({ title, supportingText, icon }: FeatureCardProps) => {
  return (
    <div className='p-8 rounded-2xl shadow-lg border border-border/80'>
        <div className='w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4 text-primary/80'>
          {icon}
        </div>
        <h3 className='text-lg font-semibold mb-2 text-foreground font-display'>{title}</h3>
        <p className='text-foreground/70'>{supportingText}</p>
    </div>
  )
}


export const FeaturesSection = () => {
  return (
    <div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {campexFeatures.map((feature, index) => (
                <FeatureCard 
                    key={index}
                    title={feature.title}
                    supportingText={feature.supportingText}
                    icon={feature.icon}
                />
            ))}
        </div>
    </div>
  )
}

export default FeaturesSection;
