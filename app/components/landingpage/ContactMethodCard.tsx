
export interface ContactMethodCardProps {
    icon: string;
    title: string;
    description: string;
    value: string;
}

const ContactMethodCard = ({method}: {method: ContactMethodCardProps}) => {
  return (
    <div className='text-center p-6 rounded-lg bg-muted'>
        <div className='text-4xl mb-4'>{method.icon}</div>
        <h3 className='font-bold text-lg mb-2'>{method.title}</h3>
        <p className='text-sm text-muted-foreground mb-3'>{method.description}</p>
        <p className='font-medium text-foreground'>{method.value}</p>
    </div>
  )
}

export default ContactMethodCard;