import React from 'react'
import { FaSearch } from 'react-icons/fa'

interface DashboardSearchBarProps {
  placeholder?: string
  className?: string
}

export const DashboardSearchBar = ({
  placeholder = 'Search products, orders…',
  className,
}: DashboardSearchBarProps) => {
  return (
    <label className={`flex min-w-0 flex-1 items-center gap-2 rounded-full bg-foreground/5 px-4 py-2 transition focus-within:ring-2 focus-within:ring-primary ${className ?? ''}`}>
      <FaSearch className="text-foreground/50" aria-hidden="true" />
      <input
        type="search"
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-foreground/40 focus:outline-none p-2"
      />
    </label>
  )
}

export default DashboardSearchBar
