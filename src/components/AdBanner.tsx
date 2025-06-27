"use client";

import React, { useEffect, useState } from 'react';
import Card from './Card';

interface Ad {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface AdBannerProps {
  ads: Ad[];
}

const AdBanner: React.FC<AdBannerProps> = ({ ads }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 8000); // Change ad every 8 seconds
    
    return () => clearInterval(interval);
  }, [ads.length]);
  
  const currentAd = ads[currentAdIndex];
  
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-2 right-2 bg-accent text-primary-bg text-xs px-2 py-1 rounded z-10">
        Sponsored
      </div>
      <a href={currentAd.link} className="block">
        <div className="space-y-3">
          <div className="w-full h-32 overflow-hidden rounded-md">
            <img 
              src={currentAd.image} 
              alt={currentAd.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <h4 className="font-semibold text-accent">{currentAd.title}</h4>
          <p className="text-sm text-text-secondary">{currentAd.description}</p>
        </div>
      </a>
    </Card>
  );
};

export default AdBanner;
