"use client";

import React, { useState, useRef } from 'react';
import Card from './Card';

interface VideoItem {
  id: number;
  title: string;
  videoUrl?: string;
  imageUrl?: string;
}

interface VideoCarouselProps {
  videos: VideoItem[];
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    const clickPosition = clientX - left;
    
    // If click is on the left side, go to previous video, otherwise go to next
    if (clickPosition < width / 2) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  const currentVideo = videos[currentIndex];

  return (
    <div 
      className="relative w-full h-full cursor-pointer"
      onClick={handleClick}
    >
      <Card className="h-full flex flex-col">
        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-secondary-bg to-transparent z-10">
          <h3 className="text-xl font-bold text-accent">{currentVideo.title}</h3>
        </div>
        
        <div className="flex-grow flex items-center justify-center overflow-hidden">
          {currentVideo.videoUrl ? (
            <video
              ref={videoRef}
              src={currentVideo.videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : currentVideo.imageUrl ? (
            <img 
              src={currentVideo.imageUrl}
              alt={currentVideo.title}
              className="w-full h-full object-contain"
            />
          ) : null}
        </div>
        
        {/* Subtle indicators for navigation */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {videos.map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-accent' : 'bg-gray-500'}`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default VideoCarousel;
