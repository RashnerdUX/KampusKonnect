import React, {useState} from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router'

export const Navbar = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
    const navigate = useNavigate()

    const openMobileMenu = () => {
        setIsMobileMenuOpen(true)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    
  return (
    <>
      <nav className="bg-background px-[35px] lg:px-[99px] py-[30px]">

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-between items-center align-middle">
          {/* TODO: Ensure you change to index route once the app is deployed */}
          <Link to={'/'} className="text-2xl font-bold">
            {/* <img src='/logo/logo-light.svg' alt='Campex Logo' className='block w-full dark:hidden object-cover object-center'/>
            <img src='/logo/logo-dark.svg' alt='Campex Logo' className='hidden w-full dark:block object-cover object-center'/> */}
            Campex
          </Link>
          <div className="space-x-6 flex justify-center items-center">
            <NavLink to="/" className="navlink">Home</NavLink>
            <NavLink to="/marketplace" className="navlink">Marketplace</NavLink>
            <NavLink to="/about" className="navlink">About</NavLink>
            <NavLink to="/blog" className="navlink">Blog</NavLink>
            <NavLink to="/contact-us" className="navlink">Contact</NavLink>
          </div>
          <div className="space-x-4 flex justify-center items-center">
              <Link to='/login' className="bg-transparent border-2 border-foreground text-foreground font-medium text-base md:text-[16px] px-4 py-2 md:px-[40px] md:py-4 md:w-auto rounded-full transition-colors">
                Log In
              </Link>
              <Link to="/register" className="bg-primary text-primary-foreground font-medium text-base md:text-[16px] px-4 py-2 md:px-[40px] md:py-4 rounded-full transition-colors md:w-auto">
                Get Started
              </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex justify-between items-center">
          <div className="text-2xl font-bold" onClick={() => navigate('/landing')}>Campex</div>
          <button type='button' onClick={openMobileMenu}>
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
                <button type="button" className="text-2xl font-bold bg-transparent border-0 p-0" onClick={() => {navigate('/'); closeMobileMenu();}}>
                  {/* TODO: Replace with logo */}
                  Campex</button>
                <button onClick={closeMobileMenu} autoFocus>
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col flex-1">
                <div className='flex flex-col space-y-4 flex-1'>
                  <NavLink to="/" className="navlink" onClick={closeMobileMenu}>Home</NavLink>
                  <NavLink to="/marketplace" className="navlink" onClick={closeMobileMenu}>Marketplace</NavLink>
                  <NavLink to="/about" className="navlink" onClick={closeMobileMenu}>About</NavLink>
                  <NavLink to="/blog" className="navlink" onClick={closeMobileMenu}>Blog</NavLink>
                  <NavLink to="/contact-us" className="navlink" onClick={closeMobileMenu}>Contact</NavLink>
                </div>
                <div className='mt-auto w-full flex flex-col space-y-2'>
                  <Link to={'/login'} className="bg-transparent border-2 border-foreground text-primary-foreground font-medium text-base px-4 py-2 rounded-full transition-colors flex items-center justify-center" onClick={() => {closeMobileMenu();}}>
                    Log In
                  </Link>
                  <Link to={'/register'} className="bg-primary text-primary-foreground font-medium text-base px-4 py-2 rounded-full transition-colors flex items-center justify-center" onClick={() => {closeMobileMenu();}}>
                    Get Started
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar;
