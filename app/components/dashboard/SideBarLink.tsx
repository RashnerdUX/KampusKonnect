import React from 'react'
import { Link, NavLink } from 'react-router';
import { TbLayoutDashboardFilled, TbSettingsFilled } from "react-icons/tb";
import { FaBagShopping, FaUser } from "react-icons/fa6";

interface SideBarLinkProps {
    to: string;
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

export const SideBarLinks: Omit<SideBarLinkProps, 'onClick'>[] = [
    {
        to: '/vendor',
        label: 'Dashboard Home',
        icon: <TbLayoutDashboardFilled />,
    },
    {
        to: '/vendor/products',
        label: 'Products',
        icon: <FaBagShopping />,
    },
    {
        to: '/vendor/profile',
        label: 'Profile',
        icon: <FaUser />,
    },
    {
        to: '/vendor/settings',
        label: 'Settings',
        icon: <TbSettingsFilled />,
    },
]

export const SideBarLink = ({ to, label, icon, onClick }: SideBarLinkProps) => (
  <NavLink
    to={to}
    end={to === '/vendor'}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-2 rounded-full px-4 py-3 transition ${
        isActive ? 'bg-primary text-primary-foreground shadow-lg' : 'text-foreground/70 hover:bg-foreground/10'
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
)

export default SideBarLink;
