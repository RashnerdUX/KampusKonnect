import React from 'react'

export interface BlogPostCardProps {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

const BlogPostCard = ({ post }: {post: BlogPostCardProps}) => {
  return (
    <article
        className='rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group'
    >
        <div className='relative h-48 bg-muted overflow-hidden'>
            <img
                src={post.image}
                alt={post.title}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            />
            <div className='absolute top-4 left-4'>
                <span className='inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium'>
                    {post.category}
                </span>
            </div>
        </div>
        <div className='p-6'>
            <p className='text-sm text-foreground/70 mb-2'>{post.date}</p>
            <h3 className='text-xl font-bold text-foreground mb-3 transition-colors'>
                {post.title}
            </h3>
            <p className='text-muted-foreground mb-4'>{post.excerpt}</p>
            <a
                href='#'
                className='inline-block text-foreground font-medium hover:underline group-hover:text-primary/80 transition-colors'
            >
                Read More →
            </a>
        </div>
    </article>
  )
}

export default BlogPostCard;