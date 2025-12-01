import React from 'react'
import { Form } from "react-router"
import { SideBarLinks, SideBarLink } from './SideBarLink';
import { TbLogout } from "react-icons/tb";
import { FaTimes } from "react-icons/fa";

interface SideNavigationBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideNavigationBar = ({ isOpen, onClose }: SideNavigationBarProps) => (
  <>
    {/* Overlay for mobile */}
    {isOpen && (
      <div 
        className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
        onClick={onClose}
        aria-hidden="true"
      />
    )}

    {/* Sidebar */}
    <div className={`
      fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
      lg:static lg:z-auto lg:w-[280px] lg:translate-x-0 lg:py-6 lg:pl-4
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="relative bg-card w-full h-full px-6 py-4 lg:rounded-2xl flex flex-col justify-between">

        {/* Close button for mobile */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-foreground/70 hover:bg-muted lg:hidden"
          aria-label="Close menu"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        {/* Top Section */}
        <div>
          {/* Logo */}
          <div className="mb-10 mt-2">
            <h1 className="text-2xl font-bold text-foreground">Campex</h1>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col space-y-2">
            {SideBarLinks.map(({ to, label, icon }) => (
              <SideBarLink key={to} to={to} label={label} icon={icon} onClick={onClose} />
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className='flex flex-col justify-end'>
          {/* Logout button */}
          <Form className="mt-4" method="post">
            <button 
              type='submit' 
              name='_action' 
              value="logout" 
              className="flex items-center gap-2 rounded-full px-4 py-3 text-foreground/70 hover:text-red-400 hover:font-bold w-full cursor-pointer transition-colors duration-200"
            >
              <TbLogout />
              Logout
            </button>
          </Form>
        </div>
      </div>
    </div>
  </>
)

export default SideNavigationBar;