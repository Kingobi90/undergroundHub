"use client";

import React, { useEffect, useState } from 'react';

interface NewsTickerProps {
  headlines: string[];
}

const NewsTicker: React.FC<NewsTickerProps> = ({ headlines }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % headlines.length);
    }, 5000); // Change headline every 5 seconds
    
    return () => clearInterval(interval);
  }, [headlines.length]);
  
  return (
    <div className="bg-accent text-primary-bg py-2 px-4 overflow-hidden relative">
      <div className="flex items-center">
        <div className="font-bold mr-3 bg-red-600 text-white px-2 py-0.5 rounded">
          BREAKING
        </div>
        <div className="whitespace-nowrap" style={{ animation: 'slide-left 20s linear infinite' }}>
          {headlines[currentIndex]}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
