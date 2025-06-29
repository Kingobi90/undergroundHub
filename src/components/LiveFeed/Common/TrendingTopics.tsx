import React from 'react';
import { useLiveFeed } from '../../../contexts/LiveFeedContext';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const TrendingTopics: React.FC = () => {
  const { trendingTopics } = useLiveFeed();
  
  // Helper function to get trend icon
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <FaArrowUp className="text-green-500" />;
      case 'down':
        return <FaArrowDown className="text-red-500" />;
      case 'stable':
        return <FaMinus className="text-gray-500" />;
    }
  };

  if (trendingTopics.length === 0) {
    return <div className="text-gray-400">No trending topics</div>;
  }

  return (
    <div className="space-y-3">
      {trendingTopics.map(topic => (
        <div key={topic.id} className="flex items-center justify-between">
          <div className="flex-1">
            <div className="font-medium hover:text-yellow-400 cursor-pointer">
              #{topic.topic}
            </div>
            <div className="text-xs text-gray-400">
              {topic.relatedPosts} related posts
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-sm mr-1">
              {getTrendIcon(topic.trend)}
            </div>
            <div className="text-xs font-medium">
              {topic.popularity}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingTopics;
