"use client";

import React from 'react';
import Card from '../../Card';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: Date | string;
  url?: string;
}

interface NewsSectionProps {
  title: string;
  items?: NewsItem[];
  icon?: React.ReactNode;
}

const NewsSection: React.FC<NewsSectionProps> = ({
  title,
  items = [],
  icon
}) => {
  // Format timestamp
  const formatTime = (date: Date | string) => {
    if (!date) return '';
    
    const newsDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - newsDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return newsDate.toLocaleDateString();
  };

  const handleNewsClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <button className="text-accent text-sm">See all</button>
      </div>
      
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleNewsClick(item.url)}
              className="p-2 border-b border-accent-30 last:border-0 cursor-pointer hover:bg-accent-30 rounded-md"
            >
              <h4 className="font-medium text-white text-sm">{item.title}</h4>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-text-secondary">{item.source}</span>
                <span className="text-xs text-text-secondary">{formatTime(item.timestamp)}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-text-secondary text-sm text-center py-2">No news items available</p>
        )}
      </div>
    </Card>
  );
};

export default NewsSection;
