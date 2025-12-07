import React from 'react'

export const ButtonSpinner = () => {
  return (
    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status" aria-label="Loading" />
  )
}

export default ButtonSpinner;