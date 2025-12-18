import React from 'react'
import { FaSearch } from 'react-icons/fa'

interface DashboardSearchBarProps {
  placeholder?: string
  className?: string
  onClick?: () => void
}

export const DashboardSearchBar = ({
  placeholder = 'Search products, orders, customers...Find anything',
  className,
  onClick,
}: DashboardSearchBarProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex min-w-0 flex-1 items-center gap-2 rounded-full 
        bg-foreground/5 px-4 py-3 
        transition hover:bg-foreground/10 
        focus:outline-none focus:ring-2 focus:ring-primary 
        ${className ?? ''}
      `}
    >
      <FaSearch className="text-foreground/50" aria-hidden="true" />
      <span className="flex-1 text-left text-sm font-medium text-foreground/40">
        {placeholder}
      </span>
      {/* Keyboard shortcut hint */}
      <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted/20 px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  )
}

export default DashboardSearchBar
