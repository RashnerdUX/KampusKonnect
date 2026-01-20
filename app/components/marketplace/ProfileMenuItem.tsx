import React from 'react'
import { IoChevronForwardOutline } from "react-icons/io5";

export interface profileMenuItemId {
  id: 'orders' | 'wishlist' | 'reviews' | 'vouchers' | 'wallet' | 'notifications' | 'support' | 'settings' | 'logout';
}

export interface profileMenuItem {
  id: profileMenuItemId['id'];
  menutype: 'primary' | 'secondary';
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  count?: number | null;
  buttonType?: 'link' | 'button' | 'submit';
  isDestructive?: boolean;
}

interface ProfileMenuItemProps {
  item: profileMenuItem;
  isActive?: boolean;
  onClick?: () => void;
}

const ProfileMenuItem = ({ item, isActive = false, onClick }: ProfileMenuItemProps) => {
  const Icon = item.icon;

  if (item.menutype === 'primary') {
    return (
      <li>
        <button
          type="button"
          onClick={onClick}
          className={`w-full flex items-center justify-between pl-6 pr-2 py-4 transition-colors ${
            isActive
              ? 'bg-primary/10 text-primary border-l-4 border-primary'
              : 'text-foreground hover:bg-muted'
          }`}
        >
          <div className='flex items-center gap-3'>
            <Icon size={20} />
            <span className='font-medium'>{item.label}</span>
          </div>
          <div className='flex items-center gap-2'>
            {item.count !== null && item.count !== undefined && (
                <span className='bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center'>
                {item.count}
                </span>
            )}
            <IoChevronForwardOutline size={16} />
          </div>
        </button>
      </li>
    );
  }

  // Secondary menu item
  return (
    <li>
      <button
        type={item.buttonType === 'submit' ? 'submit' : 'button'}
        onClick={onClick}
        className={`w-full flex items-center justify-between gap-3 pl-6 pr-2 py-4 transition-colors ${
          item.isDestructive
            ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950'
            : 'text-foreground hover:bg-muted'
        }`}
      >
        <div className='flex items-center gap-3'>
            <Icon size={20} />
            <span className='font-medium'>{item.label}</span>
        </div>

        <IoChevronForwardOutline size={16} />
      </button>
    </li>
  );
};

export default ProfileMenuItem;