import type { Route } from './+types/about';
import Navbar from '~/components/NavBar';
import Footer from '~/components/Footer';
import TeamMemberCard from '~/components/landingpage/TeamMemberCard';
import type { TeamMember } from '~/components/landingpage/TeamMemberCard';
import CTAcard from '~/components/landingpage/CTAcard';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { data } from 'react-router';


export const meta = () => {
    return [
        { title: "What is Campex | Get to know more about us - Campex" },
        { name: "description", content: "Learn more about Campex, our mission, vision, and the team dedicated to connecting students with the best campus essentials." },
    ];
}

export const loader = async ({request}: Route.LoaderArgs) => {

    // Use service role key to access protected data
    const service_key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const {supabase} = createSupabaseServerClient(request, service_key);

    // Get the count for Impact stats and team members list from the database
    const [teamMemberData, platformMetrics] = await Promise.all([
        // Get team members
        supabase.from('team_members').select('*'),

        // Get counts for impact stats
        // Count number of users where is_active is true
        supabase.from('platform_metrics').select('*', { count: 'exact' }).single(),
    ]); 

    console.log("Active students: ", platformMetrics.data);

    return data(
        {
            teamMembers: teamMemberData.data || [],
            impactStats: {
                activeStudents: platformMetrics.data?.users || 0,
                campusVendors: platformMetrics.data?.vendors || 0,
                campusLocations: platformMetrics.data?.active_universities || 0,
                productsAvailable: platformMetrics.data?.products || 0,
            }
        }
    );
}

const AboutUs = ({loaderData}: Route.ComponentProps) => {

    const { teamMembers, impactStats } = loaderData;

    const { activeStudents, campusVendors, campusLocations, productsAvailable } = impactStats;

  return (
    <>
        <Navbar />
        <main>
            {/* Hero section */}
            <section className='bg-gradient-to-b from-background via-muted to-primary/30 py-16 lg:py-24'>
                <div className='max-w-4xl mx-auto px-4 text-center'>
                    <h1 className='text-5xl lg:text-6xl font-bold mb-4'>About Campex</h1>
                    <p className='text-lg lg:text-xl text-muted-foreground'>Connecting Students with Campus Essentials</p>
                </div>
            </section>

            {/* Our Story */}
           <section className="max-w-7xl mx-auto px-4 py-10 lg:py-16">
                <div className='flex flex-col lg:flex-row gap-2'>

                    {/* An image */}
                    <div className='flex-2 lg:mr-12 mb-8 lg:mb-0'>
                        <img src="/images/about-us-filler.jpg" alt="About Campex" className="w-full h-80dvh rounded-lg shadow-md mb-8" />
                    </div>

                    {/* The story */}
                    <div className='flex flex-col items-start justify-start flex-3'>

                        <div className='flex flex-col gap-2 justify-center items-start mb-6'>
                            <h2 className="text-sm font-bold text-secondary uppercase tracking-wider">Our Story</h2>
                            <h1 className="text-5xl text-foreground font-bold font-display">Started as an Idea</h1>
                        </div>
                        <p className="text-lg text-muted-foreground mb-4">
                            Campex was born out of a simple idea: to make campus life easier for students. We understand the challenges students face in accessing essential products and services on and around their campuses. Our mission is to bridge this gap by providing a seamless platform that connects students with trusted vendors offering everything they need, from textbooks and electronics to food and personal care items.
                        </p>
                        <p className="text-lg text-muted-foreground mb-4">
                            Since our inception, we have been committed to creating a user-friendly experience that prioritizes convenience, affordability, and reliability. Our dedicated team works tirelessly to onboard reputable vendors and ensure that students have access to high-quality products at competitive prices.
                        </p>
                    </div>
                </div>
           </section>

           {/* Our Impact Section */}
           <section className="max-w-7xl mx-auto px-4">
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-12'>

                    {/* Our Impact */}
                    <div className='flex flex-col justify-center items-start my-4 lg:my-16'>
                        <h2 className="text-sm font-bold mb-4 text-secondary uppercase tracking-wider">Our Impact So Far</h2>
                        <h1 className="text-5xl text-foreground mb-12 font-bold text-wrap">Connecting thousands of students across Nigeria</h1>
                    </div>

                    {/* Impact Stats */}
                    <div className="grid grid-cols-2 gap-y-0 gap-x-4 text-center p-6">
                        <div className='impact-stat-container'>
                            <h2 className="impact-stat-title">{activeStudents}</h2>
                            <p className="impact-stat-subtitle">Active Students</p>
                        </div>
                        <div className='impact-stat-container'>
                            <h2 className="impact-stat-title">{campusVendors}</h2>
                            <p className="impact-stat-subtitle">Campus Vendors</p>
                        </div>
                        <div className='impact-stat-container'>
                            <h2 className="impact-stat-title">{campusLocations}</h2>
                            <p className="impact-stat-subtitle">Campus Locations</p>
                        </div>
                        <div className='impact-stat-container'>
                            <h2 className="impact-stat-title">{productsAvailable}</h2>
                            <p className="impact-stat-subtitle">Products Available</p>
                        </div>
                    </div>
                </div>
           </section>

           {/* Our Team */}
           <section className='max-w-7xl mx-auto px-4 py-16'>
                <div className='flex flex-col lg:flex-row gap-6 lg:gap-12 justify-between mb-10'>
                    <div className='flex flex-col gap-4'>
                        <h2 className="text-sm font-bold text-secondary uppercase tracking-wider">Our Team</h2>
                        <h1 className="text-5xl font-bold text-foreground">Meet the Team</h1>
                    </div>

                    <div className='lg:ml-12 w-[480px]'>
                        <p className="text-lg text-muted-foreground mb-4">
                            Behind Campex is a passionate team of individuals dedicated to making a difference in the lives of students. Our diverse team brings together expertise in technology, e-commerce, and customer service, all united by a shared commitment to our mission.
                        </p>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-4 gap-x-6 gap-y-12'>
                    {/* Team Member Cards */}
                    {teamMembers.map((member, index) => (
                        <TeamMemberCard key={index} member={member} />
                    ))}
                </div>
           </section>

           {/* CTA Section */}
           <section className="max-w-7xl mx-auto px-4 py-16">
                <CTAcard />
           </section>

        </main>

        <footer id='footer' className='relative py-6 bg-footer-background text-footer-foreground'>
            <Footer />
        </footer>
    </>
  )
};

export default AboutUs;