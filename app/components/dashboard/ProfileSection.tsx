import React from 'react'

interface ProfileSectionProps {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const ProfileSection = ({ title, action, children, className }: ProfileSectionProps) => {
  return (
    <section className={`rounded-2xl border border-border bg-card p-5 shadow-sm ${className ?? ''}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export default ProfileSection
