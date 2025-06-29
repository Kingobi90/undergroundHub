"use client";

import React from 'react';
import Card from './Card';
import { useLiveFeed } from '@/contexts/LiveFeedContext';
import { FaNewspaper, FaGlobeAmericas, FaFlag } from 'react-icons/fa';

// Import left column components
import ProfileSection from './LinkedInStyleFeed/LeftColumn/ProfileSection';
import RecommendedThreads from './LinkedInStyleFeed/LeftColumn/RecommendedThreads';
import SupermarketDeals from './LinkedInStyleFeed/LeftColumn/SupermarketDeals';
import RestaurantDeals from './LinkedInStyleFeed/LeftColumn/RestaurantDeals';

// Import middle column components
import PostCreator from './LinkedInStyleFeed/MiddleColumn/PostCreator';
import FeedContent from './LinkedInStyleFeed/MiddleColumn/FeedContent';

// Import right column components
import FinalsCountdown from './LiveFeed/Common/FinalsCountdown';
import EventsSection from './LinkedInStyleFeed/RightColumn/EventsSection';
import PollSection from './LinkedInStyleFeed/RightColumn/PollSection';
import CampusMap from './LinkedInStyleFeed/RightColumn/CampusMap';
import NewsSection from './LinkedInStyleFeed/RightColumn/NewsSection';

// Mock data for news sections
const concordiaNews = [
  {
    id: '1',
    title: 'New Computer Science Building Opening Next Month',
    source: 'Campus News',
    timestamp: new Date(Date.now() - 3600000 * 2) // 2 hours ago
  },
  {
    id: '2',
    title: 'Student Government Elections: Results Announced',
    source: 'Student Affairs',
    timestamp: new Date(Date.now() - 3600000 * 5) // 5 hours ago
  },
  {
    id: '3',
    title: 'Professor Johnson Receives National Research Award',
    source: 'Faculty News',
    timestamp: new Date(Date.now() - 3600000 * 8) // 8 hours ago
  },
  {
    id: '4',
    title: 'Campus Dining Adds New Vegan Options',
    source: 'Campus Life',
    timestamp: new Date(Date.now() - 3600000 * 12) // 12 hours ago
  }
];

const worldNews = [
  {
    id: '1',
    title: 'Global Climate Summit Reaches New Agreement',
    source: 'World News Network',
    timestamp: new Date(Date.now() - 3600000 * 3) // 3 hours ago
  },
  {
    id: '2',
    title: 'Tech Giants Announce Collaboration on AI Ethics',
    source: 'Tech Daily',
    timestamp: new Date(Date.now() - 3600000 * 6) // 6 hours ago
  },
  {
    id: '3',
    title: 'International Space Station Welcomes New Crew',
    source: 'Space News',
    timestamp: new Date(Date.now() - 3600000 * 10) // 10 hours ago
  }
];

const canadaNews = [
  {
    id: '1',
    title: 'Federal Government Announces New Student Loan Program',
    source: 'Canadian Press',
    timestamp: new Date(Date.now() - 3600000 * 4) // 4 hours ago
  },
  {
    id: '2',
    title: 'Montreal Hosts International Tech Conference',
    source: 'Quebec News',
    timestamp: new Date(Date.now() - 3600000 * 7) // 7 hours ago
  },
  {
    id: '3',
    title: 'Canadian Universities See Record International Enrollment',
    source: 'Education News',
    timestamp: new Date(Date.now() - 3600000 * 9) // 9 hours ago
  }
];

const LinkedInStyleFeed: React.FC = () => {
  const handlePostCreated = () => {
    // This would typically refresh the feed or add the new post
    console.log('Post created, refreshing feed...');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column - Only visible on md screens and up */}
        <div className="hidden md:block md:col-span-1 space-y-4">
          <ProfileSection />
          <RecommendedThreads />
          <SupermarketDeals />
          <RestaurantDeals />
        </div>
        
        {/* Middle Column - Feed (full width on mobile, 1/3 on desktop) */}
        <div className="col-span-1 md:col-span-1">
          <PostCreator onPostCreated={handlePostCreated} />
          <FeedContent />
        </div>
        
        {/* Right Column - Only visible on md screens and up */}
        <div className="hidden md:block md:col-span-1 space-y-4">
          <FinalsCountdown />
          <EventsSection />
          <PollSection />
          <CampusMap />
          
          {/* News Sections */}
          <NewsSection 
            title="Concordia News" 
            items={concordiaNews} 
            icon={<FaNewspaper className="text-accent" />} 
          />
          
          <NewsSection 
            title="World News" 
            items={worldNews} 
            icon={<FaGlobeAmericas className="text-accent" />} 
          />
          
          <NewsSection 
            title="Canada News" 
            items={canadaNews} 
            icon={<FaFlag className="text-accent" />} 
          />
        </div>
      </div>
      
      {/* Mobile-only sections that appear below the feed */}
      <div className="md:hidden space-y-4 mt-6">
        <ProfileSection />
        <FinalsCountdown />
        <EventsSection />
        <PollSection />
        <RecommendedThreads />
        <SupermarketDeals />
        <RestaurantDeals />
        <CampusMap />
        <NewsSection 
          title="Concordia News" 
          items={concordiaNews} 
          icon={<FaNewspaper className="text-accent" />} 
        />
      </div>
    </div>
  );
};

export default LinkedInStyleFeed;
