import React from 'react'
import { FaStar } from 'react-icons/fa'

interface ReviewCardProps {
  username?: string;
  avatarUrl?: string | null;
  name: string;
  review: string;
  rating: number
}

export const dummyReviews: ReviewCardProps[] = [
    {
        username: 'john_doe',
        name: 'John Doe',
        avatarUrl: null,
        review: "Great product, really enjoyed using it!",
        rating: 5
    },
    {
        username: 'jane_smith',
        name: 'Jane Smith',
        avatarUrl: null,
        review: "Good value for money. Would recommend to others.",
        rating: 4
    },
    {
        username: 'alex_92',
        name: 'Alex Johnson',
        avatarUrl: null,
        review: "Average experience, could be improved in some areas.",
        rating: 3
    },
    {
        username: 'linda_w',
        name: 'Linda Williams',
        avatarUrl: null,
        review: "Not satisfied with the quality of the product.",
        rating: 2
    }
]

const renderStars = (rating: number) => {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1)
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {stars.map((star) => (
        <FaStar
          key={star}
          className={star <= rating ? 'opacity-100' : 'opacity-30'}
          aria-hidden
        />
      ))}
    </div>
  )
}

export const ReviewCard = ({ username, name, avatarUrl, review, rating }: ReviewCardProps) => {
  return (
    <article className="w-full rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full border border-border bg-muted text-center text-sm font-semibold leading-[3rem] text-foreground">
            {avatarUrl ? <img src={avatarUrl} alt={name} className="h-12 w-12 rounded-full object-cover" /> : name.charAt(0)}
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">{name}</p>
            {username && <p className="text-sm text-foreground/70">@{username}</p>}
          </div>
        </div>
        <span>{rating} <FaStar className="inline text-yellow-400" /></span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-foreground/80">{review}</p>
    </article>
  )
}
