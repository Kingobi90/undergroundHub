import React, { useState } from 'react';
import Card from '../../Card';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: Date;
  snippet: string;
  imageUrl?: string;
  url: string;
}

const ExternalNewsFeed: React.FC = () => {
  // Mock news data - in a real implementation, this would come from an API
  const [newsItems] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'New Study Shows Benefits of Short Study Breaks',
      source: 'Education Weekly',
      date: new Date('2025-06-28T08:45:00'),
      snippet: 'Research indicates that taking short breaks during study sessions can improve retention and reduce burnout.',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      url: '#'
    },
    {
      id: '2',
      title: 'Tech Companies Announce Summer Internship Programs',
      source: 'Tech Today',
      date: new Date('2025-06-27T16:20:00'),
      snippet: 'Major tech firms have opened applications for their summer internship programs with remote options available.',
      url: '#'
    },
    {
      id: '3',
      title: 'Music Festival Season Kicks Off This Weekend',
      source: 'Entertainment Now',
      date: new Date('2025-06-26T14:10:00'),
      snippet: 'The summer music festival season begins with several major events scheduled across the country.',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      url: '#'
    }
  ]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Trending News</h3>
      
      {newsItems.map(item => (
        <Card key={item.id} className="hover:bg-gray-800 transition-colors">
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
            <div className="flex gap-3">
              {item.imageUrl && (
                <div className="w-20 h-20 flex-shrink-0">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <h4 className="font-medium">{item.title}</h4>
                <div className="flex items-center text-xs text-gray-400 mb-1">
                  <span>{item.source}</span>
                  <span className="mx-1">•</span>
                  <span>{formatDate(item.date)}</span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">{item.snippet}</p>
              </div>
              
              <div className="flex items-center text-gray-400">
                <FaExternalLinkAlt />
              </div>
            </div>
          </a>
        </Card>
      ))}
    </div>
  );
};

export default ExternalNewsFeed;
