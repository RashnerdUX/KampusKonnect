import React, {useState, useEffect} from 'react'
import { useNavigate, NavLink, Link } from 'react-router'
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react'
import type { User } from "@supabase/supabase-js";


// Navbar Component for the marketplace
import { IoPersonOutline } from "react-icons/io5";
import { BsPerson, BsPersonCheck } from "react-icons/bs";
import { FaCartFlatbed } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { CustomNavigationMenu } from './CustomNavigationMenu';

export interface Category {
  id: string;
  name: string;
  slug: string;
  emoji?: string | null;
}

interface MarketPlaceNavbarProps { 
  user: User | null;
  categories?: Category[];
}

export interface desktopLinks {
      name: string;
      path?: string;
      children?: desktopLinks[];
}

export const MarketPlaceNavbar = ({ user, categories = [] }: MarketPlaceNavbarProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
    const [isUserNameAvailable, setIsUserNameAvailable] = useState<boolean>(false)
    const [username, setUsername] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigate = useNavigate()

    const toggleSection = (section: string) => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    }

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

    // Build category children from prop
    const categoryChildren = categories.map(cat => ({
      name: cat.emoji ? `${cat.emoji} ${cat.name}` : cat.name,
      path: `/marketplace/categories/${cat.slug}`
    }));

    const desktopLinks: desktopLinks[] = [
      { name: 'Home', path: '/marketplace' },
      { name: 'Browse Products', path: '/marketplace/products' },
      { name: 'Browse Vendors', path: '/marketplace/vendors' },
      { name: 'Categories', path: '/marketplace/categories', children: categoryChildren.length > 0 ? categoryChildren : [
        { name: 'Loading...', path: '#' }
      ]},
      { name: 'About', path: '/about' },
      { name: 'Blog', path: '/blog' },
    ]

    // Mobile nav links structure
    const mobileLinks = [
      { name: 'Home', path: '/marketplace' },
      { name: 'Browse Products', path: '/marketplace/products' },
      { name: 'Browse Vendors', path: '/marketplace/vendors' },
      { 
        name: 'Categories', 
        children: categories.map(cat => ({
          name: cat.emoji ? `${cat.emoji} ${cat.name}` : cat.name,
          path: `/marketplace/categories/${cat.slug}`
        }))
      },
      { name: 'About', path: '/about' },
      { name: 'Blog', path: '/blog' },
    ]

    
  return (
    <>
      <nav className="bg-background px-[24px] md:px-[56px] lg:px-[99px] py-4 lg:py-[24px] border-b border-border">

        {/* Desktop Menu */}
        <div className="hidden lg:flex justify-between items-center">
          {/* TODO: Ensure you change to index route once the app is deployed */}
          <div className='flex md:gap-4 lg:gap-6 items-center justify-center'>
            <a href='/marketplace' className="text-2xl font-bold" >Campex</a>
            <div className="space-x-6 flex justify-center items-center">
              <CustomNavigationMenu desktopLinks={desktopLinks} />
            </div>
          </div>
          
          <div className='flex md:gap-4 lg:gap-6 items-center justify-center'>
            <div className='relative'>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/marketplace/products?q=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                  placeholder='Search products...'
                  autoFocus
                  className='pl-4 pr-10 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary w-64'
                />
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      navigate(`/marketplace/products?q=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground'
                >
                  {searchQuery.length>1 ? 
                    <button
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className='ml-2 text-muted-foreground hover:text-foreground'
                      >
                        ✕
                    </button>
                    : <FaSearch size={16} /> 
                  }
                </button>
              </div>
            <Link to={"/marketplace/wishlist"}>
              <FaCartFlatbed size={24} />
            </Link>
            {isUserNameAvailable ? (
              <Link to={"/marketplace/profile"} className='flex gap-2 items-center'>
                <BsPersonCheck size={24} />
                <span className='text-foreground/90 text-lg font-bold'> Hi, {username}</span>
              </Link>
            ) : (
              <Link to={"/register"}  className='flex gap-2 items-center' >
                <BsPerson size={24} />
                <span className='text-foreground/90 text-lg font-bold'> Login/Register </span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden flex justify-between items-center">
          <div className='flex items-center w-full gap-2'>
            <button onClick={openMobileMenu}>
              <Menu size={24} />
            </button>
            <a href='/marketplace' className="text-2xl font-bold" >Campex</a>
          </div>
          
          <div className='flex items-center justify-end gap-4 text-foreground/90'>
            <Link to={"/marketplace/search"}>
              <FaSearch size={20} />
            </Link>
            <Link to={"/marketplace/wishlist"}>
              <FaCartFlatbed size={24} />
            </Link>
            <Link to={"/marketplace/profile"}>
              {isUserNameAvailable ? <BsPersonCheck size={24} /> : <BsPerson size={24} />}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          // Backdrop
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 z-50 flex justify-end">
            {/* Mobile Menu */}
            <div className={`bg-background w-3/4 max-w-xs h-full p-6 relative flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="flex justify-between items-center mb-6">
                {isUserNameAvailable ? (
                  <div className="text-xl font-semibold text-foreground">
                    Hi, {username} 👋
                  </div>
                ) : (
                  <div className="text-lg text-muted-foreground">
                    Welcome!
                  </div>
                )}
                <button onClick={closeMobileMenu} autoFocus aria-label="Close menu">
                  <X size={24} />
                </button>
              </div>
              
              <nav className="flex flex-col flex-1 overflow-y-auto">
                <div className='flex flex-col space-y-1 flex-1'>
                  {mobileLinks.map((link) => (
                    <div key={link.name}>
                      {link.children ? (
                        // Accordion for nested items
                        <div>
                          <button
                            onClick={() => toggleSection(link.name)}
                            className="w-full flex items-center justify-between py-3 px-2 text-left navlink hover:bg-muted/50 rounded-md transition-colors"
                          >
                            <span>{link.name}</span>
                            {expandedSections[link.name] ? (
                              <ChevronUp size={18} className="text-muted-foreground" />
                            ) : (
                              <ChevronDown size={18} className="text-muted-foreground" />
                            )}
                          </button>
                          {expandedSections[link.name] && (
                            <div className="ml-4 pl-2 border-l border-border space-y-1">
                              {link.children.length > 0 ? (
                                link.children.map((child) => (
                                  <NavLink
                                    key={child.path}
                                    to={child.path}
                                    className="block py-2 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                                    onClick={closeMobileMenu}
                                  >
                                    {child.name}
                                  </NavLink>
                                ))
                              ) : (
                                <span className="block py-2 px-2 text-sm text-muted-foreground italic">
                                  No categories yet
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        // Regular link
                        <NavLink
                          to={link.path!}
                          className="block py-3 px-2 navlink hover:bg-muted/50 rounded-md transition-colors"
                          onClick={closeMobileMenu}
                        >
                          {link.name}
                        </NavLink>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Show login/register only if user is not signed in */}
                {!isUserNameAvailable && (
                  <div className='mt-auto pt-4 border-t border-border w-full flex flex-col space-y-2'>
                    <button 
                      className="bg-transparent border-2 border-foreground text-foreground font-medium text-base px-4 py-2 rounded-full transition-colors hover:bg-muted" 
                      onClick={() => {navigate('/login'); closeMobileMenu();}}
                    >
                      Log In
                    </button>
                    <button 
                      className="bg-primary text-primary-foreground font-medium text-base px-4 py-2 rounded-full transition-colors hover:bg-primary/90" 
                      onClick={() => {navigate('/register'); closeMobileMenu();}}
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </nav>
    </>  );
}

export default MarketPlaceNavbar;
