"use client";

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Card from './Card';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  image?: string;
}

interface NewsCarouselProps {
  newsItems: NewsItem[];
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ newsItems }) => {
  return (
    <div className="mb-6">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="rounded-lg overflow-hidden"
      >
        {newsItems.map((item) => (
          <SwiperSlide key={item.id}>
            <Card className="h-full">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">{item.title}</h3>
                {item.image && (
                  <div className="w-full h-48 overflow-hidden rounded-md">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-text-primary">{item.description}</p>
                <p className="text-text-secondary text-sm">{item.timestamp}</p>
              </div>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NewsCarousel;
