import React from 'react'
import { FaStar } from "react-icons/fa6";
import { Progress } from 'radix-ui';

interface RatingsTileProps {
  ratingValue: number; // This is the actual value like 5 or 4 or 3
  ratingCount: number; // This refers to the number of users that have given a 5 star rating if ratingValue is 5
}

const dummyRatingsData: RatingsTileProps[] = [
    { ratingValue: 5, ratingCount: 120 },
    { ratingValue: 4, ratingCount: 45 },
    { ratingValue: 3, ratingCount: 20 },
    { ratingValue: 2, ratingCount: 10 },
    { ratingValue: 1, ratingCount: 5 },
]

const TOTAL_REVIEWS = 200; // Example total number of reviews

export const RatingsTile = ({ ratingValue, ratingCount }: RatingsTileProps) => {
  return (
    <div className='flex items-center gap-2'>
        <FaStar className='text-yellow-400 size-6' />
        <span className='text-base font-bold text-foreground'>{ratingValue}</span>
        <Progress.Root className='w-48 h-2.5 rounded-full bg-foreground/20'>
                <Progress.Indicator
                    className='h-2.5 rounded-full bg-yellow-400 transition-all duration-300'
                    style={{ width: `${(ratingCount / TOTAL_REVIEWS) * 100}%` }}
                />
        </Progress.Root>
    </div>
  )
}

export const CustomRatingBar = () => {
    return (
        <div className='w-full rounded-full bg-foreground/30 overflow-hidden h-2.5 mx-4'>
            <div>
                <div className='rounded-full bg-yellow-400 h-2.5' style={{ width: '70%' }}></div>
            </div>
        </div>
    )
}

interface RatingsTileSectionProps {
    ratings: RatingsTileProps;
}

export const RatingsTileSection = () => {
  return (
    <div className='flex flex-col gap-4 w-full'>
        {dummyRatingsData.map((rating, index) => (
            <RatingsTile key={index} ratingValue={rating.ratingValue} ratingCount={rating.ratingCount} />
        ))}
    </div>
  )
}

export default RatingsTileSection;
