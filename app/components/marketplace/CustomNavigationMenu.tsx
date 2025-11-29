import { NavigationMenu } from "radix-ui";
import type { desktopLinks } from "./MarketPlaceNavBar";

import React from 'react'

// This is a custom navigation menu component for the marketplace
interface CustomNavigationMenuProps {
    desktopLinks: desktopLinks[];
}


export const CustomNavigationMenu = ({ desktopLinks }: CustomNavigationMenuProps) => {

  return (
  <NavigationMenu.Root className="relative">
    <NavigationMenu.List className="flex items-center justify-center flex-wrap space-x-5">
      {desktopLinks.map((link) => (
        <NavigationMenu.Item key={link.name} className="relative">
          {link.children ? (
            <>
              <NavigationMenu.Trigger className="navlink">{link.name}</NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute left-1/2 top-full z-30 mt-3 -translate-x-1/2 rounded-xl shadow-lg bg-white p-4 grid grid-cols-1 md:grid-cols-3 gap-3 min-w-[20rem]">
                {link.children.map((child) => (
                  <NavigationMenu.Link key={child.path} href={child.path} className="navlink">
                    {child.name}
                  </NavigationMenu.Link>
                ))}
              </NavigationMenu.Content>
            </>
          ) : (
            <NavigationMenu.Link href={link.path ?? "#"} className="navlink">
              {link.name}
            </NavigationMenu.Link>
          )}
        </NavigationMenu.Item>
      ))}
    </NavigationMenu.List>
  </NavigationMenu.Root>
  )
}
