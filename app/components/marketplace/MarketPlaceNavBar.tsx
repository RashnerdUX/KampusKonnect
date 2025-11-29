import React, {useState, useEffect} from 'react'
import { useNavigate, NavLink } from 'react-router'
import { Menu, X } from 'lucide-react'
import type { User } from "@supabase/supabase-js";


// Navbar Component for the marketplace
import { IoPersonOutline } from "react-icons/io5";
import { CustomNavigationMenu } from './CustomNavigationMenu';

interface MarketPlaceNavbarProps { 
  user: User | null; 
}

export interface desktopLinks {
      name: string;
      path?: string;
      children?: desktopLinks[];
}

export const MarketPlaceNavbar = ({ user }: MarketPlaceNavbarProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
    const [isUserNameAvailable, setIsUserNameAvailable] = useState<boolean>(false)
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate()

    const openMobileMenu = () => {
        setIsMobileMenuOpen(true)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    useEffect(() => {
      if (!user) return;
      const username = user.user_metadata?.username || null;
      setUsername(username);
      setIsUserNameAvailable(!!username);
    }, [user])

    const desktopLinks: desktopLinks[] = [
      { name: 'Home', path: '/marketplace' },
      { name: 'Browse Vendors', path: '/vendors' },
      { name: 'Categories', path: '/categories', children: [
        { name: 'Food & Beverages', path: '/categories/food-beverages' },
        { name: 'Books & Stationery', path: '/categories/books-stationery' },
        { name: 'Electronics', path: '/categories/electronics' },
        { name: 'Clothing & Accessories', path: '/categories/clothing-accessories' },
        { name: 'Health & Wellness', path: '/categories/health-wellness' },
        { name: 'Services', path: '/categories/services' },
      ]},
      { name: 'About', path: '/about' },
      { name: 'Blog', path: '/blog' },
    ]

    const categories = [
      'Food & Beverages',
      'Books & Stationery',
      'Electronics',
      'Clothing & Accessories',
      'Health & Wellness',
      'Services',
    ]

    
  return (
    <>
      <nav className="bg-background px-[35px] lg:px-[99px] py-[30px] border-b border-border">

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-between items-center">
          {/* TODO: Ensure you change to index route once the app is deployed */}
          <div className="text-2xl font-bold" onClick={() => navigate('/landing')}>Campex</div>
          <div className='flex space-x-12 items-center justify-center'>
            <div className="space-x-6 flex justify-center items-center">
              <CustomNavigationMenu desktopLinks={desktopLinks} />
            </div>
            <div className="space-x-4 flex justify-center items-center">
                  <button type="button" disabled={isUserNameAvailable} className="bg-transparent border-2 border-foreground text-primary-foreground font-medium text-base md:text-[16px] px-4 py-2 md:px-6 md:w-auto rounded-full transition-colors" onClick={() => {
                    if (isUserNameAvailable) return;
                    console.log('Navigating to login');
                    navigate('/login');
                  }}>
                    <IoPersonOutline className="inline mb-1 mr-2" size={16} />
                    {isUserNameAvailable ? `Hi, ${username}` : 'Log In/Sign Up'}
                  </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex justify-between items-center">
          <div className="text-2xl font-bold" onClick={() => navigate('/landing')}>Campex</div>
          <button onClick={openMobileMenu}>
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          // Backdrop
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 z-50 flex justify-end">
            {/* Mobile Menu */}
            <div className={`bg-background w-3/4 max-w-xs h-full p-6 relative flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold" onClick={() => {navigate('/landing'); closeMobileMenu();}}>
                  {/* TODO: Replace with logo */}
                  Campex</div>
                <button onClick={closeMobileMenu} autoFocus>
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col flex-1">
                <div className='flex flex-col space-y-4 flex-1'>
                  <NavLink to="/landing" className="navlink" onClick={closeMobileMenu}>Home</NavLink>
                  <NavLink to="/marketplace" className="navlink" onClick={closeMobileMenu}>Marketplace</NavLink>
                  <NavLink to="/about" className="navlink" onClick={closeMobileMenu}>About</NavLink>
                  <NavLink to="/blog" className="navlink" onClick={closeMobileMenu}>Blog</NavLink>
                </div>
                <div className='mt-auto w-full flex flex-col space-y-2'>
                  <button className="bg-transparent border-2 border-foreground text-primary-foreground font-medium text-base px-4 py-2 rounded-full transition-colors" onClick={() => {navigate('/login'); closeMobileMenu();}}>
                    Log In
                  </button>
                  <button className="bg-primary text-primary-foreground font-medium text-base px-4 py-2 rounded-full transition-colors" onClick={() => {navigate('/register'); closeMobileMenu();}}>
                    Get Started
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </nav>
    </>  );
}

export default MarketPlaceNavbar;
