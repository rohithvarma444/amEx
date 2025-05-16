'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  icon: string;
  href: string;
}

const categories: Category[] = [
  { id: '1', name: 'Food', icon: '/img1.png', href: '/categories/food' },
  { id: '2', name: 'Errands', icon: '/img2.png', href: '/categories/errands' },
  { id: '3', name: 'Electronics', icon: '/img3.png', href: '/categories/electronics' },
  { id: '4', name: 'Study Aids', icon: '/img4.png', href: '/categories/study-aids' },
  { id: '5', name: 'Mutual Benefit', icon: '/img5.jpeg', href: '/categories/mutual-benefit' },
  { id: '6', name: 'Skills', icon: '/img6.jpg', href: '/categories/skills' },
  { id: '7', name: 'Travel', icon: '/img7.jpg', href: '/categories/travel' },
  { id: '8', name: 'Hostel', icon: '/img1.png', href: '/categories/hostel' },
  { id: '9', name: 'Study', icon: '/img2.png', href: '/categories/study' },
];

export default function CategoriesSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      return () => slider.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  return (
    <div className="w-full px-4 py-6">
      <div className="flex items-center mb-4 ml-2">
        <h2 className="text-xl font-bold">Explore Categories</h2>
        <div className="ml-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>

      <div className="relative">
        {showLeftArrow && (
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2"
            aria-label="Scroll left"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}

        <div 
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide gap-6 py-4 px-2 w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={category.href}
              className="flex flex-col items-center flex-shrink-0"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-2">
                <Image 
                  src={category.icon} 
                  alt={category.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-sm font-medium text-center">{category.name}</span>
            </Link>
          ))}
        </div>

        {showRightArrow && (
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2"
            aria-label="Scroll right"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}
      </div>

      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}