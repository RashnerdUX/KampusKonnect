import React from 'react'

const SubscribeEmail = () => {
  return (
              <div className='bg-muted rounded-lg p-8 lg:p-12 text-center'>
            <h2 className='text-3xl lg:text-4xl font-bold mb-4'>Subscribe to Our Newsletter</h2>
            <p className='text-muted-foreground mb-6 max-w-2xl mx-auto text-wrap'>
              Get the latest articles, tips, and updates delivered straight to your inbox.
            </p>
            <form className='max-w-md mx-auto flex flex-col lg:flex-row gap-2'>
              <input
                type='email'
                placeholder='Enter your email'
                className='flex-1 px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary'
                required
              />
              <button
                type='submit'
                className='bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors'
              >
                Subscribe
              </button>
            </form>
          </div>
  )
}

export default SubscribeEmail;
