import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa6';

export interface TeamMember {
    name: string;
    role: string;
    photo_url: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
    };
}

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
    return (
        <div className='w-full'>
            <img src={member.photo_url} alt={member.name} className="w-full h-90dvh rounded-md mb-4 object-cover" />
            <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
            <p className="text-md text-foreground/80 mb-2">{member.role}</p>
            <div className="flex space-x-4">
                {member.socialLinks?.linkedin && (
                    <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        <FaLinkedin size={20} />
                    </a>
                )}
                {member.socialLinks?.twitter && (
                    <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        <FaTwitter size={20} />
                    </a>
                )}
                {member.socialLinks?.github && (
                    <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">
                        <FaGithub size={20} />
                    </a>
                )}
            </div>
        </div>
    )
}

export default TeamMemberCard;