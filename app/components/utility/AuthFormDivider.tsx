import React from 'react'
import DividerLine from './DividerLine';

export const AuthFormDivider = () => {
  return (
    <>
      <DividerLine />
      <span className="mx-4 flex-shrink text-sm text-gray-500 dark:text-gray-400">OR</span>
      <DividerLine />
    </>
  )
}

export default AuthFormDivider;
