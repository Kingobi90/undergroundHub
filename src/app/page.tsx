"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import VideoCarousel from '@/components/VideoCarousel';
import EventsSection from '@/components/EventsSection';
import PollSection from '@/components/PollSection';
import MoraleBar from '@/components/MoraleBar';
import HighlightsBar from '@/components/HighlightsBar';
import ThreadSection from '@/components/ThreadSection';
import CampusMap from '@/components/CampusMap';
import UnifiedFeed from '@/components/LiveFeed/UnifiedFeed/UnifiedFeed';

// Mock data for demonstration
const mockThreadData = [
  {
    id: "1",
    type: "Campus Tea" as const,
    content: "Just saw the Dean dancing at the campus coffee shop. Moves like he's still in the 90s!",
    timestamp: "2 hours ago",
    upvotes: 145,
    downvotes: 12,
    comments: [
      {
        id: "c1",
        content: "I was there too! He was playing air guitar to Bon Jovi 😂",
        timestamp: "1 hour ago",
        upvotes: 32
      },
      {
        id: "c2",
        content: "Someone please tell me there's video of this!",
        timestamp: "45 minutes ago",
        upvotes: 28
      }
    ]
  },
  {
    id: "2",
    type: "Secret" as const,
    content: "I've been pretending to understand calculus all semester. The final is tomorrow. Send help.",
    timestamp: "5 hours ago",
    upvotes: 234,
    downvotes: 5,
    comments: [
      {
        id: "c3",
        content: "Khan Academy saved my life last semester. Try the integral videos!",
        timestamp: "4 hours ago",
        upvotes: 56
      },
      {
        id: "c4",
        content: "Meet me at the library at 8pm. I'll help you cram. -Your TA",
        timestamp: "3 hours ago",
        upvotes: 89
      }
    ]
  },
  {
    id: "3",
    type: "Spotted" as const,
    content: "To the person who returned my lost laptop at the library yesterday - THANK YOU! You saved my entire thesis!",
    timestamp: "1 day ago",
    upvotes: 312,
    downvotes: 0,
    comments: [
      {
        id: "c5",
        content: "That was me! So glad you got it back safely :)",
        timestamp: "20 hours ago",
        upvotes: 145
      }
    ]
  },
  {
    id: "4",
    type: "Rant" as const,
    content: "WHY does the campus WiFi always die during finals week?! I'm trying to study here!",
    timestamp: "3 hours ago",
    upvotes: 189,
    downvotes: 2,
    comments: []
  }
];

const mockNewsData = {
  // Breaking news headlines for the ticker
  breakingNews: [
    "Campus Security Alert: Suspicious activity reported near West Dorms. Avoid the area.",
    "Basketball Team Advances to National Finals - Game this Saturday!",
    "University President to Step Down Next Semester - Search for Replacement Begins",
    "Tuition Freeze Announced for Next Academic Year - Student Council Celebrates Victory"
  ],
  
  // Videos for the video carousel
  videos: [
    {
      id: 1,
      title: "Stingers Mascot Reveal",
      imageUrl: "/images/stingers-mascot.png",
    },
    {
      id: 2,
      title: "Flash Mob in the Quad",
      videoUrl: "/videos/muscular-wasp-flexes.mp4",
    },
    {
      id: 3,
      title: "Basketball Team Highlights",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-basketball-player-doing-a-slam-dunk-2285-large.mp4",
    },
    {
      id: 4,
      title: "New Science Building Tour",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tour-of-a-large-university-campus-4363-large.mp4",
    },
    {
      id: 5,
      title: "Dorm Life: Uncensored",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-on-a-laptop-in-a-living-room-4830-large.mp4",
    },
  ],
  
  // Secondary news items
  secondaryNews: [
    {
      id: 2,
      title: "Student Government Elections Next Week",
      description: "Don't forget to cast your vote for next year's student representatives. Polling stations will be open across campus.",
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      title: "New Food Truck Arrives on Campus",
      description: "The popular 'Burger Blitz' food truck will be stationed near the student center every Tuesday and Thursday.",
      timestamp: "Yesterday"
    },
    {
      id: 4,
      title: "Basketball Team Advances to Finals",
      description: "Our university basketball team defeated State College 78-65 to advance to the championship game.",
      timestamp: "2 days ago"
    }
  ]
};

// Mock ads for the ad banner
const mockAds = [
  {
    id: 1,
    title: "50% Off at Campus Bookstore",
    description: "Get half off all merchandise this week only!",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    link: "#"
  },
  {
    id: 2,
    title: "New Coffee Shop Opening",
    description: "Grand opening special: Free pastry with any drink purchase",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    link: "#"
  },
  {
    id: 3,
    title: "Campus Fitness Center",
    description: "Student special: $20/month membership with no commitment",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    link: "#"
  }
];

const mockConfession = {
  id: 1,
  text: "I saw my professor at the campus bar last night doing karaoke to 'I Will Survive' and now I can't look at them the same way during lectures",
  timestamp: "30 minutes ago",
  upvotes: 87,
  downvotes: 3
};

const mockEvent = {
  id: 1,
  name: "End of Semester Bash",
  location: "The Quad",
  dateTime: "Friday, June 30th @ 8PM",
  description: "Join us for the biggest party of the semester with live music, food, and games to celebrate the end of finals!"
};

const mockEvents = [
  {
    id: 1,
    title: "End of Semester Bash",
    location: "The Quad",
    timestamp: "Friday, 8PM",
    description: "Join us for the biggest party of the semester! Live DJ, food trucks, and more!"
  },
  {
    id: 2,
    title: "Basketball Finals",
    location: "Campus Arena",
    timestamp: "Saturday, 6PM",
    description: "Cheer on our team as they compete for the championship!"
  },
  {
    id: 3,
    title: "Career Fair",
    location: "Student Union",
    timestamp: "Monday, 10AM-4PM",
    description: "Meet recruiters from top companies and explore job opportunities."
  }
];

const mockPoll = {
  id: 1,
  question: "What's the best study spot on campus?",
  options: [
    { id: 1, text: "Library", votes: 45 },
    { id: 2, text: "Student Center", votes: 32 },
    { id: 3, text: "Coffee Shop", votes: 28 },
    { id: 4, text: "Dorm Room", votes: 15 }
  ],
  totalVotes: 120
};

const mockPolls = [
  {
    id: 1,
    question: "What's your favorite campus hangout spot?",
    options: [
      { id: 1, text: "The Quad", votes: 45 },
      { id: 2, text: "Student Union", votes: 32 },
      { id: 3, text: "Library Café", votes: 28 },
      { id: 4, text: "Rooftop Garden", votes: 18 }
    ],
    totalVotes: 123
  },
  {
    id: 2,
    question: "Should finals week be extended to two weeks?",
    options: [
      { id: 1, text: "Yes, more time to study", votes: 24 },
      { id: 2, text: "No, one week of stress is enough", votes: 78 }
    ],
    totalVotes: 102
  }
];

export default function Home() {
  const [feedView, setFeedView] = useState<'classic' | 'unified'>('unified');

  return (
    <main className="min-h-screen bg-primary-bg">
      <Header />
      
      <MoraleBar initialMorale={78} totalVotes={243} />
      <HighlightsBar 
        trendingThread={{ 
          id: '1', 
          title: mockThreadData[0].content, 
          link: '/thread/1' 
        }}
        todayDeals={[
          { id: '1', title: '50% off at Campus Grill', link: '/deals/1' },
          { id: '2', title: 'BOGO Boba at Tea Time', link: '/deals/2' }
        ]}
        weekEvents={[
          { id: '1', title: 'End of Semester Bash - Friday', link: '/events/1' },
          { id: '2', title: 'Basketball Finals - Saturday', link: '/events/2' }
        ]}
      />
      
      {/* View toggle buttons */}
      <div className="container mx-auto px-4 pt-24 pb-4">
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setFeedView('unified')} 
            className={`px-4 py-2 rounded-full ${feedView === 'unified' ? 'bg-accent text-white' : 'bg-secondary-bg text-text-primary'}`}
          >
            Twitter-Style Feed
          </button>
          <button 
            onClick={() => setFeedView('classic')} 
            className={`px-4 py-2 rounded-full ${feedView === 'classic' ? 'bg-accent text-white' : 'bg-secondary-bg text-text-primary'}`}
          >
            Classic View
          </button>
        </div>
      </div>
      
      {feedView === 'unified' ? (
        <div className="container mx-auto px-4 pb-10">
          <UnifiedFeed />
        </div>
      ) : (
        <div className="container mx-auto px-4 pb-10">
          <div className="flex flex-col lg:flex-row gap-6 p-4">
            {/* Left column - Video Feed with exact dimensions */}
            <div className="w-full lg:w-[680px] flex-shrink-0">
              <div className="h-[896px]">
                <VideoCarousel videos={mockNewsData.videos} />
              </div>
            </div>
            
            {/* Right column - Thread Section */}
            <div className="flex-grow">
              <ThreadSection threads={mockThreadData} />
            </div>
          </div>
          
          {/* Bottom row for other sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 mt-6">
            <EventsSection events={mockEvents} />
            <PollSection polls={mockPolls} />
            
            {/* Ad space */}
            <div className="bg-secondary-bg border border-accent rounded-lg p-4 text-center lg:col-span-2">
              <p className="text-text-secondary text-sm mb-2">SPONSORED</p>
              <p className="text-accent font-bold">Campus Bookstore</p>
              <p className="text-text-primary text-sm">50% off all UG merch this week!</p>
            </div>
            
            {/* Campus Map */}
            <div className="lg:col-span-2 mt-6">
              <CampusMap />
            </div>
          </div>
        </div>
      )}
      
      <footer className="bg-secondary-bg border-t border-accent-30 py-4">
        <div className="container mx-auto px-4 text-center text-text-secondary">
          <p> {new Date().getFullYear()} UG - The Underground Campus Hub</p>
        </div>
      </footer>
    </main>
  );
}
