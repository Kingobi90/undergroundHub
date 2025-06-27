"use client";

import React from 'react';
import Card from './Card';
import NewsTicker from './NewsTicker';
import NewsCarousel from './NewsCarousel';
import AdBanner from './AdBanner';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  image?: string;
}

interface NewsSectionProps {
  featuredNews: NewsItem[];
  secondaryNews: NewsItem[];
  breakingNews: string[];
  ads: {
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
  }[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ featuredNews, secondaryNews, breakingNews, ads }) => {
  return (
    <div className="space-y-6">
      {/* Breaking News Ticker */}
      <NewsTicker headlines={breakingNews} />
      
      <h2 className="section-header">
        <span>📰 CAMPUS NEWS FLASH</span>
      </h2>
      
      {/* Featured News Carousel */}
      <NewsCarousel newsItems={featuredNews} />
      
      {/* Secondary News with Ad Banner */}
      <div className="space-y-4">
        {secondaryNews.map((news, index) => (
          <React.Fragment key={news.id}>
            {/* Insert ad banner after the first news item */}
            {index === 1 && (
              <div className="my-6">
                <AdBanner ads={ads} />
              </div>
            )}
            
            <Card>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-text-primary">{news.title}</h4>
                <p className="text-text-primary">{news.description}</p>
                <p className="text-text-secondary text-sm">{news.timestamp}</p>
              </div>
            </Card>
            {index < secondaryNews.length - 1 && (
              <div className="border-b border-accent-30 my-4"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
