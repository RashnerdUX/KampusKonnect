import React from 'react'

interface ReviewsCardProps {
  id: string
  name: string
  university: string
  reviewText: string
  rating?: number
  avatarUrl?: string
}

const reviews = [
    {
        id: "1",
        name: "Akinyoola Abdullahi Akinwale",
        university: "LAUTECH",
        reviewText: "Thank you for coming up with this innovative idea. I didn't really think it'd work, I just filled it out just for fun but alas, I got a customer on it within 24 hours. Thank you for putting this up, I am very hopeful it'll serve its purpose efficiently and the rating? It's absolutely 5 of 5",
    },
    {
        id: "2",
        name: "Emmanuel Olamide",
        university: "FUOYE",
        reviewText: "It very nice using your service at first I taught it won’t work out but so surprised Rating you guys for today service will definitely give 5 stars ⭐️",
    },
    {
        id: "3",
        name: "Ojo Maryanne",
        university: "Thomas Adewumi University",
        reviewText: "I appreciate that I am able to get an online vendor for something I want and I think this is an excellent idea. This vendor has nice and quality bags and shoes. I totally love everything she showed me. I am trying to decide which one to get now.",
    },
    {
        id: "4",
        name: "Akinrinade Itunuoluwa",
        university: "LAUTECH",
        reviewText: "The linking up was 100/10. I loved it,it was so fast and quick",
    },
]

export const ReviewsCard = ({ id, name, university, reviewText, rating, avatarUrl }: ReviewsCardProps) => {
  return (
    <div>
        <div className="bg-card p-6 rounded-2xl shadow-md h-full flex flex-col justify-between">
            <p className="text-foreground/80 mb-4 flex-grow">"{reviewText}"</p>
            <div className="flex items-center mt-4">
                {avatarUrl ? (
                    <img src={avatarUrl} alt={`${name}'s avatar`} className="w-12 h-12 rounded-full mr-4" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center text-xl font-semibold text-white">
                        {name.charAt(0)}
                    </div>
                )}
                <div className='flex flex-col gap-1'>
                    <p className="font-semibold text-foreground">{name}</p>
                    <p className="text-sm text-foreground/70">{university}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export const ReviewsCardSection = () => {
  return (
    <div className="columns-1 md:columns-2 gap-6">
      {reviews.map((review, index) => (
        <div key={review.id} className="break-inside-avoid mb-6">
          <ReviewsCard
            id={review.id}
            name={review.name}
            university={review.university}
            reviewText={review.reviewText}
          />
        </div>
      ))}
    </div>
  );
}

export default ReviewsCardSection;
