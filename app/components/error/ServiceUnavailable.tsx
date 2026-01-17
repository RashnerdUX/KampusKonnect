import React from 'react'
import Navbar from '../NavBar';

const ServiceUnavailable = () => {
  return (
    <main className="flex min-h-dvh flex-col">
        <Navbar />

        <div className='flex flex-col items-center justify-center p-6 text-center'>
            <h1 className="mb-4 text-7xl font-bold text-yellow-600">503</h1>
            <p className="mb-2 text-2xl font-semibold">Service temporarily unavailable</p>
            <p className="mb-8 max-w-md text-muted-foreground">
                We're performing maintenance or experiencing high traffic. Please try again in a few minutes.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
            >
                Retry
            </button>
        </div>
    </main>
  )
}

export default ServiceUnavailable;