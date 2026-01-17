import React from 'react'

export interface Guide {
  title: string;
  description: string;
  readTime: string;
}

const GuideCard = ({ guide }: { guide: Guide }) => {
  return (
    <a
        href='#'
        className='group rounded-lg border border-border p-6 hover:border-primary hover:shadow-lg transition-all'
    >
        <h3 className='font-bold text-lg mb-2 group-hover:text-primary transition-colors'>
            {guide.title}
        </h3>
        <p className='text-muted-foreground text-sm mb-4'>{guide.description}</p>
        <p className='text-xs text-muted-foreground'>{guide.readTime}</p>
    </a>
  )
}

export default GuideCard;