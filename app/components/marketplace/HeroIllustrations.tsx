import React from 'react';

// Floating decorative illustrations for the marketplace hero section
export const HeroIllustrations = () => {
  return (
    <>
      {/* Left side illustrations */}
      <div className="hidden lg:block absolute left-4 xl:left-12 top-1/4 opacity-80">
        {/* Shopping bag */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-float-slow"
        >
          <rect x="12" y="20" width="40" height="36" rx="4" fill="#F59E0B" />
          <path
            d="M20 20V16C20 10.4772 24.4772 6 30 6H34C39.5228 6 44 10.4772 44 16V20"
            stroke="#FCD34D"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="26" cy="34" r="3" fill="#FEF3C7" />
          <circle cx="38" cy="34" r="3" fill="#FEF3C7" />
        </svg>
      </div>

      <div className="hidden lg:block absolute left-8 xl:left-24 bottom-1/3 opacity-70">
        {/* Book */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-float-medium"
        >
          <path
            d="M8 12C8 9.79086 9.79086 8 12 8H44C46.2091 8 48 9.79086 48 12V48H12C9.79086 48 8 46.2091 8 44V12Z"
            fill="#3B82F6"
          />
          <path d="M12 48C9.79086 48 8 46.2091 8 44V44C8 41.7909 9.79086 40 12 40H48V48H12Z" fill="#1D4ED8" />
          <rect x="14" y="14" width="20" height="3" rx="1.5" fill="#BFDBFE" />
          <rect x="14" y="20" width="28" height="2" rx="1" fill="#BFDBFE" opacity="0.6" />
          <rect x="14" y="25" width="24" height="2" rx="1" fill="#BFDBFE" opacity="0.6" />
        </svg>
      </div>

      <div className="hidden xl:block absolute left-16 top-12 opacity-60">
        {/* Star burst */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-pulse-slow"
        >
          <path
            d="M16 2L18.5 12.5L29 16L18.5 19.5L16 30L13.5 19.5L3 16L13.5 12.5L16 2Z"
            fill="#FCD34D"
          />
        </svg>
      </div>

      {/* Right side illustrations */}
      <div className="hidden lg:block absolute right-4 xl:right-12 top-1/4 opacity-80">
        {/* Laptop/Electronics */}
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-float-medium"
        >
          <rect x="12" y="16" width="48" height="32" rx="4" fill="#6366F1" />
          <rect x="16" y="20" width="40" height="24" rx="2" fill="#312E81" />
          <path d="M8 48H64L60 56H12L8 48Z" fill="#A5B4FC" />
          <rect x="28" y="52" width="16" height="2" rx="1" fill="#6366F1" />
          {/* Screen content */}
          <circle cx="36" cy="32" r="6" stroke="#818CF8" strokeWidth="2" fill="none" />
          <path d="M40 36L44 40" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="hidden lg:block absolute right-8 xl:right-24 bottom-1/3 opacity-70">
        {/* Coffee cup */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-float-slow"
        >
          <path
            d="M8 16H32V40C32 42.2091 30.2091 44 28 44H12C9.79086 44 8 42.2091 8 40V16Z"
            fill="#78716C"
          />
          <path d="M8 16H32V20H8V16Z" fill="#A8A29E" />
          <path
            d="M32 20H36C38.2091 20 40 21.7909 40 24V28C40 30.2091 38.2091 32 36 32H32"
            stroke="#A8A29E"
            strokeWidth="3"
            fill="none"
          />
          {/* Steam */}
          <path
            d="M16 8C16 8 18 6 16 4"
            stroke="#E7E5E4"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-steam"
          />
          <path
            d="M24 10C24 10 26 8 24 6"
            stroke="#E7E5E4"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-steam-delayed"
          />
        </svg>
      </div>

      <div className="hidden xl:block absolute right-16 top-12 opacity-60">
        {/* Small circle decoration */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-pulse-slow"
        >
          <circle cx="12" cy="12" r="10" fill="#34D399" opacity="0.8" />
          <circle cx="12" cy="12" r="5" fill="#6EE7B7" />
        </svg>
      </div>

      {/* Additional floating elements */}
      <div className="hidden xl:block absolute left-1/4 top-8 opacity-50">
        {/* Price tag */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-float-fast rotate-12"
        >
          <path
            d="M4 8C4 5.79086 5.79086 4 8 4H20L36 20L20 36L4 20V8Z"
            fill="#EC4899"
          />
          <circle cx="12" cy="12" r="3" fill="#FDF2F8" />
        </svg>
      </div>

      <div className="hidden xl:block absolute right-1/4 top-10 opacity-50">
        {/* T-shirt */}
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-float-medium -rotate-6"
        >
          <path
            d="M14 6L8 10L4 18L10 20V38H34V20L40 18L36 10L30 6C30 6 28 10 22 10C16 10 14 6 14 6Z"
            fill="#8B5CF6"
          />
          <path
            d="M14 6C14 6 16 10 22 10C28 10 30 6 30 6"
            stroke="#A78BFA"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Bottom decorative dots */}
      <div className="hidden lg:block absolute left-1/3 bottom-20 opacity-40">
        <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="4" fill="#FCD34D" />
          <circle cx="30" cy="10" r="3" fill="#34D399" />
          <circle cx="50" cy="10" r="5" fill="#F472B6" />
        </svg>
      </div>

      <div className="hidden lg:block absolute right-1/3 bottom-24 opacity-40">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="12" height="12" rx="2" fill="#60A5FA" opacity="0.7" className="animate-pulse-slow" />
          <rect x="23" y="23" width="12" height="12" rx="2" fill="#A78BFA" opacity="0.7" className="animate-pulse-slow" />
        </svg>
      </div>
    </>
  );
};

export default HeroIllustrations;
