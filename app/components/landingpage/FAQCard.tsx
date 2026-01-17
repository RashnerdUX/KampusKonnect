import React from 'react'

export interface FAQCardProps {
  question: string;
  answer: string;
}

const FAQCard = ({faq} : {faq: FAQCardProps}) => {
  return (
    <details className='group border border-border rounded-lg p-6 cursor-pointer'>
        <summary className='font-medium flex items-center justify-between hover:text-primary transition-colors'>
            {faq.question}
            <span className='group-open:rotate-180 transition-transform'>▼</span>
        </summary>
        <p className='text-muted-foreground mt-4 pt-4 border-t border-border'>{faq.answer}</p>
    </details>
  )
}

export default FAQCard;