import React from 'react'

const CTAcard = () => {
  return (
    <div className="bg-gradient-to-b from-footer-background/80 to-footer-background backdrop-blur-sm rounded-2xl p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className='flex flex-col mb-6 lg:mb-0 lg:mr-8 text-center lg:text-left'>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-footer-foreground">Ready to Get Started?</h2>
                <p className="text-lg text-footer-foreground/80 mb-6">Join Campex today and experience the convenience of campus shopping at your fingertips.</p>
            </div>

            <div>
                <a 
                    href="/register" 
                    className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-primary/90 transition"
                >
                    Join Now
                </a>
            </div>
        </div>
    </div>
  )
}

export default CTAcard;