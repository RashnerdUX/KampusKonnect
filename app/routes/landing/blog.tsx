import type { Route } from './+types/blog';
import { useState } from 'react';
import Navbar from '~/components/NavBar';
import Footer from '~/components/Footer';
import CTAcard from '~/components/landingpage/CTAcard';
import BlogPostCard from '~/components/landingpage/BlogPostCard';
import SubscribeEmail from '~/components/landingpage/SubscribeEmail';
import type { BlogCategorySortButtonProps } from '~/components/landingpage/BlogCategorySortButton';
import BlogCategorySortButton from '~/components/landingpage/BlogCategorySortButton';

export const meta = () => {
    return [
        { title: "Campex Blog | Tips, Stories & Campus Insights" },
        { name: "description", content: "Read the latest articles, tips, and stories about campus life, student entrepreneurship, and vendor insights on the Campex Blog." },
    ];
}

export const action = async ({ request }: Route.ActionArgs) => {
    // Handle newsletter subscription form submission
    if (request.method !== "POST") {
        return { error: "Method not allowed", success: false };
    }
    const formData = await request.formData();
    const email = formData.get("email");

    // Add email subscription logic here (e.g., save to database or send to email marketing service)
    console.log("Newsletter subscription:", { email });

    return { message: "Thank you for subscribing to our newsletter!", success: true };
};

const Blog = ({}: Route.ComponentProps) => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Campus Essentials Every Student Should Have",
      category: "Student Tips",
      date: "January 10, 2026",
      excerpt: "Discover the must-have items that will make your campus life easier and more comfortable.",
      image: "/images/categories/essentials.jpg",
    },
    {
      id: 2,
      title: "How to Start Your Own Campus Business",
      category: "Entrepreneurship",
      date: "January 5, 2026",
      excerpt: "A beginner's guide to launching your own venture and reaching thousands of students on Campex.",
      image: "/images/categories/business.jpg",
    },
    {
      id: 3,
      title: "Student Interview: Success Stories from Campex Vendors",
      category: "Stories",
      date: "December 28, 2025",
      excerpt: "Meet the vendors who have built thriving businesses connecting with students across Nigeria.",
      image: "/images/categories/stories.jpg",
    },
    {
      id: 4,
      title: "Budget-Friendly Shopping Tips for Students",
      category: "Student Tips",
      date: "December 20, 2025",
      excerpt: "Learn how to make the most of your budget and find the best deals on campus.",
      image: "/images/categories/budget.jpg",
    },
    {
      id: 5,
      title: "The Future of Campus Commerce",
      category: "Industry Insights",
      date: "December 15, 2025",
      excerpt: "Exploring how platforms like Campex are transforming the way students shop on campus.",
      image: "/images/categories/future.jpg",
    },
    {
      id: 6,
      title: "Building Community: Campex Events & Meetups",
      category: "Community",
      date: "December 10, 2025",
      excerpt: "Join us for exclusive events where students and vendors come together to connect and celebrate.",
      image: "/images/categories/community.jpg",
    },
  ];

  const categories : BlogCategorySortButtonProps[] = [
      {
        id: 1,
        name: "All",
      },
      {
        id: 2,
        name: "Student Tips",
      },
      {
        id: 3,
        name: "Entrepreneurship",
      },
      {
        id: 4,
        name: "Stories",
      },
      {
        id: 6,
        name: "Industry Insights",
      },
      {
        id: 5,
        name: "Community",
      },
  ]

  const handleBlogSort = (category: BlogCategorySortButtonProps) => {
    // Implement blog sorting logic based on category
    setIsSelectedSort(category.id)
    console.log("Sorting blog posts by category:", category.name);
  }

  const [isSelectedSort, setIsSelectedSort] = useState<number>(1);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero section */}
        <section className='bg-gradient-to-b from-background via-muted to-primary/30 py-16 lg:py-24'>
          <div className='max-w-4xl mx-auto px-4 text-center'>
            <h1 className='text-4xl lg:text-6xl font-bold mb-4'>Campex Blog</h1>
            <p className='text-sm lg:text-xl text-muted-foreground'>Tips, insights, and stories from our community</p>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 py-6 lg:pt-16">
          <div className='flex flex-wrap gap-3 justify-center mb-12'>
            {categories.map((category) => (
              <BlogCategorySortButton key={category.id} id={category.id} name={category.name} handleSort={() => handleBlogSort(category)} selected={category.id === isSelectedSort} />
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="max-w-7xl mx-auto px-4 pt-12 pb-8">
            <SubscribeEmail />
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 py-8 lg:pt-12 lg:pb-16">
          <CTAcard />
        </section>
      </main>

      <footer id='footer' className='relative py-6 bg-footer-background text-footer-foreground'>
        <Footer />
      </footer>
    </>
  );
};

export default Blog;