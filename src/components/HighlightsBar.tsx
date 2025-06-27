"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFire, FaTag, FaCalendarAlt } from 'react-icons/fa';

interface HighlightItem {
  id: string;
  title: string;
  link: string;
}

interface HighlightsBarProps {
  trendingThread?: HighlightItem;
  todayDeals?: HighlightItem[];
  weekEvents?: HighlightItem[];
}

const HighlightsBar: React.FC<HighlightsBarProps> = ({
  trendingThread = { id: '1', title: 'The library coffee shop is giving out free samples today!', link: '/thread/1' },
  todayDeals = [
    { id: '1', title: '50% off at Campus Grill', link: '/deals/1' },
    { id: '2', title: 'BOGO Boba at Tea Time', link: '/deals/2' }
  ],
  weekEvents = [
    { id: '1', title: 'End of Semester Bash - Friday', link: '/events/1' },
    { id: '2', title: 'Basketball Finals - Saturday', link: '/events/2' }
  ]
}) => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Handle scroll event to hide/show the highlights bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide when scrolling down past threshold
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } 
      // Show when scrolling up
      else if (currentScrollY < lastScrollY) {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  return (
    <div 
      className="bg-secondary-bg border border-accent w-full py-2 px-4 fixed top-[100px] left-0 right-0 z-30 transition-transform duration-300"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(-100%)' }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Trending Thread */}
          <div className="flex items-center">
            <div className="flex items-center gap-2 text-accent">
              <FaFire className="text-red-500" />
              <span className="text-xs font-bold uppercase">Trending:</span>
            </div>
            <Link 
              href={trendingThread.link} 
              className="ml-2 text-sm text-text-primary hover:text-accent truncate"
            >
              {trendingThread.title}
            </Link>
          </div>
          
          {/* Today's Deals */}
          <div className="flex items-center">
            <div className="flex items-center gap-2 text-accent">
              <FaTag className="text-green-500" />
              <span className="text-xs font-bold uppercase">Deals Today:</span>
            </div>
            <div className="ml-2 overflow-hidden">
              {todayDeals.map((deal, index) => (
                <Link 
                  key={deal.id} 
                  href={deal.link}
                  className="text-sm text-text-primary hover:text-accent block truncate"
                >
                  {deal.title}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Events This Week */}
          <div className="flex items-center">
            <div className="flex items-center gap-2 text-accent">
              <FaCalendarAlt className="text-blue-500" />
              <span className="text-xs font-bold uppercase">Events:</span>
            </div>
            <div className="ml-2 overflow-hidden">
              {weekEvents.map((event, index) => (
                <Link 
                  key={event.id} 
                  href={event.link}
                  className="text-sm text-text-primary hover:text-accent block truncate"
                >
                  {event.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightsBar;
