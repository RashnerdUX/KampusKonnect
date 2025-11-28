import React from 'react'
import { AiOutlineBell, AiOutlineQuestionCircle } from 'react-icons/ai'
import { BsMoon } from 'react-icons/bs'
import type { User } from '@supabase/supabase-js'

import DashboardSearchBar from '~/components/dashboard/DashboardSearchBar'
import ThemeToggle from '../ThemeToggle'

interface DashboardTopBarProps {
    user: User;
}

export const DashboardTopBar = ({ user }: DashboardTopBarProps) => {
    const { username, full_name } = user.user_metadata ?? {}
    const displayName = full_name || username || user.email

    return (
      <header className="hidden lg:flex gap-4 rounded-2xl bg-card px-6 py-2.5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">

        {/* Display Message */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground"> Hi,{displayName}. Welcome back</h1>
          <p className="text-sm text-foreground/70">Here's what's happening with your store today.</p>
        </div>

        {/* The Actions */}
        <div className="flex flex-1 items-center gap-4 justify-end">
          <DashboardSearchBar className="max-w-[50%]" />
          <div className="hidden items-center gap-3 lg:flex bg-foreground/5 rounded-full p-2">
            <button type="button" className="rounded-full border border-border p-2 text-foreground/70 transition hover:bg-background hover:text-foreground">
              <AiOutlineBell className="size-4" aria-hidden="true" />
              <span className="sr-only">Notifications</span>
            </button>
            <button type="button" className="rounded-full border border-border p-2 text-foreground/70 transition hover:bg-background hover:text-foreground">
              <AiOutlineQuestionCircle className="size-4" aria-hidden="true" />
              <span className="sr-only">Help center</span>
            </button>
            <ThemeToggle />
          </div>
          <div className='hidden items-center gap-3 lg:flex bg-foreground/5 rounded-full py-2 pr-4 pl-2'>
            <img src="/images/avatar-placeholder.png" alt="user-avatar" className='m-2 rounded-full size-4 border border-border' />
            <span className='text-foreground/70'>{displayName}</span>
          </div>
        </div>
      </header>
    )
}

export default DashboardTopBar;