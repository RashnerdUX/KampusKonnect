import React from 'react'

interface CustomCarouselControlProps {
    index: number;
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
}

export const CustomCarouselControl = ({ index, selectedIndex, setSelectedIndex }: CustomCarouselControlProps) => {
  return (
    <>
        <button 
        className={`${selectedIndex === index ? 'active-carousel-indicator' : 'carousel-indicator'} transition-all duration-300`} 
        onClick={() => setSelectedIndex(index)} />
    </>
  )
}

export default CustomCarouselControl;
