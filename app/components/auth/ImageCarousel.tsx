import React, {useState, useEffect} from 'react'
import CustomCarouselControl from './CustomCarouselControl';

interface ImageCarouselItem {
    src: string;
    alt: string;
    index: number;
    text: string;
    caption: string;
}

interface ImageCarouselProps {
    items?: ImageCarouselItem[];
}

export const ImageCarousel = ({ items }: ImageCarouselProps) => {

    const defaultItems: ImageCarouselItem[] = [
        { src: '/images/find-vendors.jpg', alt: 'Carousel Image 1', index: 0, text: 'Connect', caption: 'Connect easily with fellow students and vendors on your campus.' },
        { src: '/images/order-delivery.jpg', alt: 'Carousel Image 2', index: 1, text: 'Quick Delivery', caption: 'Get your orders delivered quickly and reliably.' },
        { src: '/images/reduced-costs.jpg', alt: 'Carousel Image 3', index: 2, text: 'Reduced Costs', caption: 'Cut down on expenses by buying and selling directly within your campus community.' },
    ]

    const [selectedIndex, setSelectedIndex] = useState(0);

    const carouselItems = items && items.length > 0 ? items : defaultItems;
    // Run an effect to auto-advance the carousel every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [carouselItems.length]);

    const handleUserSelect = (index: number) => {
        setSelectedIndex(index);
    }

    const currentItem = carouselItems[selectedIndex];
    const options = carouselItems.map((_, i) => i);

  return (
    <>
        <div className='relative hidden h-full lg:flex items-end rounded-xl bg-cover bg-center' style={{ backgroundImage: `url('${currentItem.src}')` }}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
            {/* Bottom text */}
            <div className="relative p-6 text-white flex flex-col gap-6">
                <div className='flex flex-col gap-1'>
                    <h2 className="text-4xl font-bold">{currentItem.text}</h2>
                    <p className="text-sm">{currentItem.caption}</p>
                </div>
                <div className='flex items-center'>
                    {options.map((index) => (
                        <CustomCarouselControl 
                            key={index}
                            index={index}
                            selectedIndex={selectedIndex}
                            setSelectedIndex={handleUserSelect}
                        />
                    ))}
                </div>
            </div>
        </div>
    </>
  )
}

export default ImageCarousel;
