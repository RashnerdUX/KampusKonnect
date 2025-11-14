import React from 'react'
import { FaCircleCheck } from "react-icons/fa6";

export const WaitListSuccess = () => {

    const listOfAvatars = [
        "/images/stock_avatars/avatar1.png",
        "/images/stock_avatars/avatar2.png",
        "/images/stock_avatars/avatar3.png",
    ]

  return (
    <div className='bg-background min-h-screen w-full flex flex-col'>
        {/* Main Content */}
        <div className='flex flex-1 flex-col justify-center items-center px-6'>
            <div className='shadow-md max-w-2xl w-full p-8 lg:p-12 bg-white rounded-2xl'>
                <div className='flex flex-col'>
                    {/* The Icon */}
                    <div className='flex justify-center mb-6'>
                        <div className='size-16 lg:size-20 rounded-full bg-primary/10 flex items-center justify-center'>
                            <FaCircleCheck className='size-8 lg:size-10 text-primary' />
                        </div>
                    </div>

                    {/* The header */}
                    <h1 className='font-[800] mb-4 lg:mb-6 text-xl lg:text-3xl leading-[1.3] text-black text-center'>
                        Thank you for joining our 
                        <span className='text-primary'> waitlist!</span>
                    </h1>

                    {/* The statement */}
                    <p className='text-black/70 mb-10 text-center'>
                        We’re excited to have you on board. We'll be in touch with updates and launch details soon.
                    </p>

                    {/* The image collection */}
                    <div className='relative flex flex-col gap-2'>
                        <div className="flex justify-center">
                            <div className="flex -space-x-3">
                                {listOfAvatars.map((src) => (
                                <img
                                    key={src}
                                    src={src}
                                    alt=""
                                    className="size-10 rounded-full border-2 border-white object-cover bg-muted flex-shrink-0"
                                />
                                ))}
                            </div>
                        </div>
                        <p className='text-[8px] lg:text-xs text-center'>You're not alone, <span className='text-primary font-bold'>1,500+</span> people joined! </p>
                    </div>
                </div>
            </div>
        </div>
        <footer className="w-full text-center text-sm border-t border-border mt-auto py-4 text-foreground/80 flex gap-2 justify-center items-center">
            © 2025 Kampus Konnect · All Rights Reserved
        </footer>
    </div>
  )
}

export default WaitListSuccess;