import React, { useState, useEffect, useCallback } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from 'react-router'
import { FaSearch, FaBox, FaShoppingCart, FaCog, FaUser, FaPlus, FaTimes } from 'react-icons/fa'

interface DashboardCommandMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const DashboardCommandMenu = ({ isOpen, onClose }: DashboardCommandMenuProps) => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Reset search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearch('')
    }
  }, [isOpen])

  const runCommand = useCallback((command: () => void) => {
    onClose()
    command()
  }, [onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="command-menu-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Command Menu Container */}
      <div className="absolute inset-0 flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
        <Command
          className="pointer-events-auto w-full max-w-lg rounded-xl border border-border bg-popover shadow-2xl overflow-hidden"
          style={{ animation: 'scaleIn 0.15s ease-out' }}
          loop
        >
          {/* Search Input */}
          <div className="flex items-center gap-2 border-b border-border px-4">
            <FaSearch className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search products, orders, settings..."
              className="flex-1 bg-transparent py-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>

          {/* Results */}
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found{search ? ` for "${search}"` : ''}.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="Quick Actions" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              <Command.Item
                value="add-product"
                onSelect={() => runCommand(() => navigate('/vendor/products/add'))}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground data-[selected=true]:bg-accent"
              >
                <FaPlus className="h-4 w-4 text-muted-foreground" />
                Add New Product
              </Command.Item>
            </Command.Group>

            {/* Navigation */}
            <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              <Command.Item
                value="products"
                onSelect={() => runCommand(() => navigate('/vendor/products'))}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground data-[selected=true]:bg-accent"
              >
                <FaBox className="h-4 w-4 text-muted-foreground" />
                Products
              </Command.Item>
              <Command.Item
                value="orders"
                onSelect={() => runCommand(() => navigate('/vendor/orders'))}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground data-[selected=true]:bg-accent"
              >
                <FaShoppingCart className="h-4 w-4 text-muted-foreground" />
                Orders
              </Command.Item>
              <Command.Item
                value="profile"
                onSelect={() => runCommand(() => navigate('/vendor/profile'))}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground data-[selected=true]:bg-accent"
              >
                <FaUser className="h-4 w-4 text-muted-foreground" />
                Profile
              </Command.Item>
              <Command.Item
                value="settings"
                onSelect={() => runCommand(() => navigate('/vendor/settings'))}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground data-[selected=true]:bg-accent"
              >
                <FaCog className="h-4 w-4 text-muted-foreground" />
                Settings
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer with keyboard hints */}
          <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">↵</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">Esc</kbd>
              <span>Close</span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  )
}

export default DashboardCommandMenu
