import React, {useEffect, useState} from 'react'
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {

    // Track the state of the theme
    const [isDarkMode, setIsDarkMode] = useState(false);
    // Ensure the component is mounted before accessing window or document
    const [isMounted, setIsMounted] = useState(false);

    // This sets the theme on initial load
    useEffect(() => {
        // Retrieve the current theme from localStorage
        const currentTheme = localStorage.getItem('theme');
        // Retrieve the system preference for dark mode
        const preferDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // If the stored theme is dark or if there is no stored theme but the system prefers dark mode
        if (currentTheme === 'dark' || (!currentTheme && preferDarkMode)){
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        }

        setIsMounted(true);
    }, [])

    // Manual function for toggling the theme
    const toggleTheme = () => {
        if (isDarkMode){
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    }

    // This prevents hydration mismatch
    if (!isMounted) {
        return null; 
    }

  return (
    <div>
        <button 
            onClick={toggleTheme}
            className="p-2 rounded-full border border-border hover:bg-background transition-colors"
            aria-label="Toggle Theme"
        >
            { isDarkMode ? (<Sun className='size-4 text-yellow-400' />) : (<Moon className='size-4 text-gray-400'/>) }
        </button>
    </div>
  )
}

export default ThemeToggle;