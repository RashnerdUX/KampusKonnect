import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'

interface VerifiedBadgeProps {
  verified: boolean
  className?: string
}

export const VerifiedBadge = ({ verified, className }: VerifiedBadgeProps) => {
  if (!verified) return null

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 ${className ?? ''}`}
    >
      <FaCheckCircle className="h-3 w-3" aria-hidden="true" />
      Verified
    </span>
  )
}

export default VerifiedBadge
