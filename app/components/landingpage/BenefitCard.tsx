import React from 'react'

interface BenefitCardProps {
  /** Primary headline for the benefit */
  title: string
  /** Supporting copy explaining the value */
  subtext: string
  /** Image or illustration shown near the bottom-left corner */
  SvgIllustration: React.ComponentType<React.SVGProps<SVGSVGElement>>
  /** Optional alt text override; falls back to title when not provided */
  imageAlt?: string
  /** Optional className to extend styling where needed */
  className?: string
  backgroundImage?: string
}

export const BenefitCard = ({title, subtext, SvgIllustration, imageAlt, className = '', backgroundImage}: BenefitCardProps) => {
  return (
    <div className={`relative w-full p-4 rounded-2xl bg-card/50 backdrop-blur-sm ${className}`}>
      {/* Background image overlay */}
      {backgroundImage ? (
        <div
          className='pointer-events-none absolute inset-0 bg-cover bg-center opacity-20'
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : null}

      {/* Copy block */}
      <div className='relative flex flex-col space-y-2 rounded-2xl bg-card p-4 lg:pb-6'>
        <h2 className='text-xl font-display font-semibold text-foreground'>{title}</h2>
        <p className='text-base text-foreground/70'>{subtext}</p>
      </div>

      {/* Illustration */}
      <div className='pointer-events-none flex items-end justify-end w-full'>
        <SvgIllustration
          {...(imageAlt ?? title
           ? { role: 'img', 'aria-label': imageAlt ?? title } : { 'aria-hidden': true, focusable: false })}
        />
      </div>
    </div>
  )
}


export default BenefitCard;