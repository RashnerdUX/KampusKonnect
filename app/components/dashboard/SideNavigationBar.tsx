import React from 'react'
import { Form } from "react-router"
import { SideBarLinks, SideBarLink } from './SideBarLink';
import { TbLogout } from "react-icons/tb";


export const SideNavigationBar = () => (
  <div className="max-h-dvh w-[20%] py-6 px-4">
    <div className="relative bg-card w-full px-6 py-4 rounded-2xl flex flex-col justify-between h-full">

        {/* Top Section */}
        <div className=''>
            {/* Logo */}
            <div className="mb-10">
                <h1 className="text-2xl font-bold text-foreground" onClick={() => {}}>Campex</h1>
            </div>

            {/* Menu Items */}
            <nav className="flex flex-col space-y-4">
            {SideBarLinks.map(({ to, label, icon }) => (
                <SideBarLink key={to} to={to} label={label} icon={icon} />
            ))}
            </nav>
        </div>

        {/* Bottom Section */}
        <div className='flex flex-col justify-end'>
          {/* Add Product button */}
          <div>

          </div>

          {/* Logout button */}
            <Form className="mt-4" method="post">
                <button type='submit' name='_action' value="logout" className="flex items-center gap-2 rounded-full px-4 py-3 text-foreground/70 hover:text-red-400 hover:font-bold w-full cursor-pointer transition-colors duration-200">
                    <TbLogout />
                    Logout
                </button>
            </Form>
        </div>
    </div>
  </div>
)

export default SideNavigationBar;