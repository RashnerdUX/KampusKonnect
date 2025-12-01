import React from 'react'
import { AiOutlineBell, AiOutlineQuestionCircle, AiOutlineMenu } from 'react-icons/ai'
import type { User } from '@supabase/supabase-js'

import DashboardSearchBar from '~/components/dashboard/DashboardSearchBar'
import ThemeToggle from '../ThemeToggle'

interface DashboardTopBarProps {
    user: User;
    onMenuClick: () => void;
}

export const DashboardTopBar = ({ user, onMenuClick }: DashboardTopBarProps) => {
    const { username, full_name } = user.user_metadata ?? {}
    const displayName = full_name || username || user.email

    return (
      <>
        {/* Mobile Header */}
        <header className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 lg:hidden">
          {/* Menu button */}
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-foreground/70 transition hover:bg-muted hover:text-foreground"
            aria-label="Open menu"
          >
            <AiOutlineMenu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <h1 className="text-xl font-bold text-foreground">Campex</h1>

          {/* User avatar */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <img 
              src="/images/avatar-placeholder.png" 
              alt="user-avatar" 
              className="h-8 w-8 rounded-full border border-border" 
            />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex gap-4 rounded-2xl bg-card px-6 py-2.5 lg:flex-row lg:items-center lg:justify-between lg:gap-4">

          {/* Display Message */}
          <div className="flex flex-col gap-1 shrink-0">
            <h1 className="text-xl font-semibold text-foreground xl:text-2xl"> Hi, {displayName}. Welcome back</h1>
            <p className="text-sm text-foreground/70 hidden xl:block">Here's what's happening with your store today.</p>
          </div>

          {/* The Actions */}
          <div className="flex flex-1 items-center gap-3 justify-end">
            {/* Search bar - hidden on lg, visible on xl */}
            <DashboardSearchBar className="hidden xl:flex max-w-xs 2xl:max-w-md" />
            
            <div className="flex items-center gap-2 bg-foreground/5 rounded-full p-1.5 xl:p-2">
              <button type="button" className="rounded-full border border-border p-1.5 xl:p-2 text-foreground/70 transition hover:bg-background hover:text-foreground">
                <AiOutlineBell className="size-4" aria-hidden="true" />
                <span className="sr-only">Notifications</span>
              </button>
              <button type="button" className="rounded-full border border-border p-1.5 xl:p-2 text-foreground/70 transition hover:bg-background hover:text-foreground">
                <AiOutlineQuestionCircle className="size-4" aria-hidden="true" />
                <span className="sr-only">Help center</span>
              </button>
              <ThemeToggle />
            </div>
            <div className='flex items-center gap-2 bg-foreground/5 rounded-full py-1.5 pr-3 pl-1.5 xl:py-2 xl:pr-4 xl:pl-2'>
              <img src="/images/avatar-placeholder.png" alt="user-avatar" className='rounded-full size-6 xl:size-8 border border-border' />
              <span className='text-foreground/70 text-sm hidden xl:block'>{displayName}</span>
            </div>
          </div>
        </header>
      </>
    )
}

export default DashboardTopBar;