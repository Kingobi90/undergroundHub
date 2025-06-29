import React, { useState } from 'react';
import Card from '../../Card';
import { FaChevronRight, FaExternalLinkAlt } from 'react-icons/fa';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: Date;
  snippet: string;
  imageUrl?: string;
  url: string;
}

const CampusNewsFeed: React.FC = () => {
  // Mock news data - in a real implementation, this would come from an API
  const [newsItems] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Campus Library Extends Hours for Finals Week',
      source: 'Campus News',
      date: new Date('2025-06-28T10:00:00'),
      snippet: 'The main library will be open 24/7 starting Monday to accommodate students preparing for finals.',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      url: '#'
    },
    {
      id: '2',
      title: 'Student Government Announces End of Year Festival',
      source: 'Events Office',
      date: new Date('2025-06-27T14:30:00'),
      snippet: 'The annual End of Year Festival will take place on the quad next Friday with live music, food, and activities.',
      url: '#'
    },
    {
      id: '3',
      title: 'Computer Science Department Hosts Hackathon',
      source: 'CS Department',
      date: new Date('2025-06-27T09:15:00'),
      snippet: 'Over 200 students participated in the 48-hour hackathon focused on developing solutions for campus sustainability.',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
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
      <h3 className="font-bold text-lg">Campus News</h3>
      
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
                <FaChevronRight />
              </div>
            </div>
          </a>
        </Card>
      ))}
      
      <div className="text-center">
        <a 
          href="#" 
          className="inline-flex items-center text-yellow-400 hover:underline"
        >
          View all campus news <FaExternalLinkAlt className="ml-1 text-xs" />
        </a>
      </div>
    </div>
  );
};

export default CampusNewsFeed;
