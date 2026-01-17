import React from 'react'
import Navbar from '../NavBar';

const NetworkError = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <main className="flex min-h-dvh flex-col">
        <Navbar />
        
        <div className='flex flex-col items-center justify-center p-6 text-center'>
            <h1 className="mb-4 text-6xl font-bold text-destructive">No Connection</h1>
            <p className="mb-2 text-xl font-semibold">Your network seems offline</p>
            <p className="mb-8 max-w-md text-muted-foreground">
                Check your internet connection and try again. This usually happens in areas with spotty coverage.
            </p>
            <button
                onClick={onRetry}
                className="rounded-lg bg-primary px-8 py-4 font-medium text-primary-foreground hover:bg-primary/90"
            >
                Try Again
            </button>
        </div>

    </main>
  );
}

export default NetworkError;