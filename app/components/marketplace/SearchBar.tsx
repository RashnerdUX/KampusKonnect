import React, { useEffect, useState } from 'react'
import * as Select from '@radix-ui/react-select'

interface SearchBarProps {
  onSearch?: (query: string, category: string, university: string) => void
  placeholder?: string
}

interface CustomSelectProps {
  value: string
  onValueChange: (val: string) => void
  placeholderLabel: string
  items: { value: string; label: string }[]
}

export const CustomSelect = ({ value, onValueChange, placeholderLabel, items }: CustomSelectProps) => {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger className="flex w-full items-center justify-between rounded-lg border border-foreground/30 bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
        <Select.Value placeholder={placeholderLabel} />
        <Select.Icon className="text-foreground/60">▾</Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          side='bottom'
          sideOffset={6}
          align="start"
          avoidCollisions={false}
          className="z-50 min-w-[var(--radix-select-trigger-width)] rounded-lg border border-foreground/20 bg-background shadow-lg"
        >
          <Select.Viewport className="py-2">
            {items.map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                className="flex cursor-pointer select-none items-center justify-between px-4 py-2 text-sm text-foreground/80 outline-none data-[highlighted]:bg-primary/10 data-[state=checked]:font-semibold"
              >
                <Select.ItemText>{item.label}</Select.ItemText>
                <Select.ItemIndicator className="text-primary">•</Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export const SearchBar = ({ onSearch, placeholder }: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [university, setUniversity] = useState('all')

  useEffect(() => {
    if (!onSearch) return
    onSearch(query, category, university)
  }, [query, category, university, onSearch]);

  const itemCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'food-beverages', label: 'Food & Beverages' },
    { value: 'books-stationery', label: 'Books & Stationery' },
  ];

  const universities = [{ value: 'all', label: 'All Universities' }];

  const placeholderText = 'Search for textbooks, electronics, services, and more...';


  return (
    <div className="max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-5xl">
      <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8 gap-4">
        <div className='flex flex-col md:flex-row lg:w-[60%] w-full md:gap-4'>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="search" className="text-base font-medium">Search</label>
            <div className="relative bg-gray-100 p-2 md:p-4 text-foreground rounded-lg">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder || placeholderText}
                className="w-full border-none bg-transparent focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col md:flex-row lg:w-[40%] md:gap-4 w-full'>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="category" className="text-base font-medium">
              Product Category
            </label>
            <CustomSelect value={category} onValueChange={setCategory} placeholderLabel="All Categories" items={itemCategories} />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="university" className="text-base font-medium">University</label>
            <CustomSelect value={university} onValueChange={setUniversity} placeholderLabel="All Universities" items={universities} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar