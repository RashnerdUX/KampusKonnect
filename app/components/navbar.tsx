import React, {useState} from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router'

export const Navbar = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<Boolean>(false)
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
        <div className="hidden md:flex justify-between items-center">
          {/* TODO: Ensure you change to index route once the app is deployed */}
          <div className="text-2xl font-bold" onClick={() => navigate('/landing')}>Campex</div>
          <div className="space-x-6 flex justify-center items-center">
            <NavLink to="/landing" className="navlink">Home</NavLink>
            <NavLink to="/marketplace" className="navlink">Marketplace</NavLink>
            <NavLink to="/about" className="navlink">About</NavLink>
            <NavLink to="/blog" className="navlink">Blog</NavLink>
          </div>
          <div className="space-x-4 flex justify-center items-center">
              <button className="bg-transparent border-2 border-foreground text-primary-foreground font-medium text-base md:text-[16px] px-4 py-2 md:px-[40px] md:py-4 md:w-auto rounded-full transition-colors" onClick={() => {navigate('/login'); closeMobileMenu();}}>
                Log In
              </button>
              <button className="bg-primary text-primary-foreground font-medium text-base md:text-[16px] px-4 py-2 md:px-[40px] md:py-4 rounded-full transition-colors md:w-auto" onClick={() => navigate('/register')}>
                Get Started
              </button>
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
    </>
  )
}

export default Navbar;
