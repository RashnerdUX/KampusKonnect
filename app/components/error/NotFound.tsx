import { FaArrowLeft } from 'react-icons/fa6';
import Navbar from '../NavBar';

export const NotFound = () => {
  return (
    <main className='flex min-h-dvh flex-col'>
        <Navbar />

        <div className='flex flex-col px-8 md:px-12 lg:px-16 mt-4 sm:mt-6 md:mt-8 lg:mt-12 items-center'>

            {/* Text section */}
            <div className='text-center my-auto'>
                <h1 className='text-9xl font-bold font-display mb-4'>
                    404
                </h1>
                <h1 className='text-3xl lg:text-4xl font-semibold mb-3 lg:mb-6'> Oops! This page is still under contruction </h1>

                <p className='text-sm md:text-lg mb-4'>
                    The page you're looking for doesn't exist or it's still under construction. Please return back to safety
                </p>
            </div>
            <a href="/marketplace" className='bg-primary text-primary-foreground py-2 px-4 flex items-center justify-center gap-2 rounded-4xl'>
                <FaArrowLeft />
                Back to Home
            </a>
        </div>
    </main>
  )
}

export default NotFound;
