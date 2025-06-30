"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Whisper, PanicAlert, Event, WeatherData, TrendingTopic, StudySpot, FeedItem } from '../types/liveFeed';
import { mockFeedItems, generateMoreMockFeedItems } from '../data/mockFeedData';

export type LiveFeedTab = 'whispers' | 'panic' | 'events' | 'news';

interface LiveFeedContextType {
  whispers: Whisper[];
  panicAlerts: PanicAlert[];
  events: Event[];
  weather: WeatherData | null;
  trendingTopics: TrendingTopic[];
  studySpots: StudySpot[];
  finalsDate: Date | null;
  daysUntilFinals: number | null;
  activeTab: LiveFeedTab;
  loading: boolean;
  feedItems: FeedItem[];
  
  // Methods
  setActiveTab: (tab: LiveFeedTab) => void;
  addWhisper: (whisper: Omit<Whisper, 'id' | 'timestamp' | 'likes' | 'comments'>) => void;
  likeWhisper: (id: string) => void;
  createPanicAlert: (alert: Omit<PanicAlert, 'id' | 'timestamp' | 'status' | 'helpersCount' | 'helpers'>) => void;
  helpWithPanic: (alertId: string, userId: string) => void;
  createEvent: (event: Omit<Event, 'id' | 'attendees'>) => void;
  updateStudySpotOccupancy: (id: string, occupancyPercent: number) => void;
  loadMoreFeedItems: () => Promise<FeedItem[]>;
  addFeedItem: (item: Omit<FeedItem, 'id' | 'timestamp' | 'upvotes' | 'downvotes' | 'comments'>) => void;
  upvoteFeedItem: (id: string) => void;
  downvoteFeedItem: (id: string) => void;
  addCommentToFeedItem: (feedItemId: string, content: string, anonymousId: string, parentId?: string) => void;
}

const LiveFeedContext = createContext<LiveFeedContextType | undefined>(undefined);

// Mock data for now - replace with API calls later
const mockWhispers: Whisper[] = [
  {
    id: '1',
    anonymousId: '4281',
    content: 'That professor who everyone thinks is tough? Actually has the easiest final if you go to office hours.',
    audioUrl: '/mock-audio/whisper1.mp3',
    duration: '0:42',
    category: 'academic',
    timestamp: new Date(),
    likes: 124,
    comments: 18,
    isAfterHours: false
  },
  {
    id: '2',
    anonymousId: '7193',
    content: "I've been pretending to understand calculus all semester...",
    audioUrl: '/mock-audio/whisper2.mp3',
    duration: '1:08',
    category: 'confession',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 86,
    comments: 32,
    isAfterHours: false
  },
  {
    id: '3',
    anonymousId: '3542',
    content: 'The real party tonight is at the abandoned theater, not where they told everyone.',
    audioUrl: '/mock-audio/whisper3.mp3',
    duration: '0:37',
    category: 'social',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 215,
    comments: 47,
    isAfterHours: true
  }
];

const mockPanicAlerts: PanicAlert[] = [
  {
    id: '1',
    userId: 'user1',
    anonymousId: '4281',
    courseCode: 'CALC 202',
    timestamp: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    location: 'Library',
    status: 'active',
    helpersCount: 5,
    helpers: ['helper1', 'helper2', 'helper3', 'helper4', 'helper5']
  },
  {
    id: '2',
    userId: 'user2',
    anonymousId: '7193',
    courseCode: 'CHEM 301',
    timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
    location: 'Science Building',
    status: 'being-helped',
    helpersCount: 2,
    helpers: ['helper6', 'helper7']
  }
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'PARTY AT DELTA',
    description: 'Annual end of semester bash',
    location: 'Delta House',
    startDate: new Date(2025, 6, 3, 22, 0), // July 3, 2025, 10:00 PM
    endDate: new Date(2025, 6, 4, 2, 0), // July 4, 2025, 2:00 AM
    bannerImageUrl: '/mock-images/party-banner.jpg',
    organizer: 'Delta Fraternity',
    isOfficial: false,
    attendees: 142,
    category: 'party'
  },
  {
    id: '2',
    title: 'BEACH BONFIRE',
    description: 'Chill night at the beach with music and food',
    location: 'North Shore',
    startDate: new Date(2025, 6, 4, 20, 0), // July 4, 2025, 8:00 PM
    endDate: new Date(2025, 6, 5, 0, 0), // July 5, 2025, 12:00 AM
    bannerImageUrl: '/mock-images/bonfire-banner.jpg',
    organizer: 'Surf Club',
    isOfficial: true,
    attendees: 89,
    category: 'party'
  }
];

const mockWeather: WeatherData = {
  temperature: 72,
  condition: 'Sunny',
  icon: 'sun',
  forecast: [
    { date: new Date(), condition: 'Sunny', high: 75, low: 62 },
    { date: new Date(Date.now() + 24 * 60 * 60 * 1000), condition: 'Partly Cloudy', high: 73, low: 60 },
    { date: new Date(Date.now() + 48 * 60 * 60 * 1000), condition: 'Cloudy', high: 68, low: 58 },
    { date: new Date(Date.now() + 72 * 60 * 60 * 1000), condition: 'Rain', high: 65, low: 57 },
    { date: new Date(Date.now() + 96 * 60 * 60 * 1000), condition: 'Sunny', high: 70, low: 59 }
  ]
};

const mockTrendingTopics: TrendingTopic[] = [
  { id: '1', topic: 'Finals Week', popularity: 98, trend: 'up', relatedPosts: 342 },
  { id: '2', topic: 'Stingers Mascot Reveal', popularity: 95, trend: 'up', relatedPosts: 278 },
  { id: '3', topic: 'Beach Party', popularity: 87, trend: 'up', relatedPosts: 156 },
  { id: '4', topic: 'Professor Smith', popularity: 76, trend: 'down', relatedPosts: 89 }
];

const mockStudySpots: StudySpot[] = [
  { 
    id: '1', 
    name: 'Main Library', 
    location: 'Central Campus', 
    occupancyPercent: 75, 
    occupancyPercentage: 75, 
    openUntil: '11:00 PM',
    isOpen: true,
    hasWifi: true,
    hasCoffee: false,
    hasOutlets: true,
    currentUsers: 150,
    capacity: 200
  },
  { 
    id: '2', 
    name: 'Student Center', 
    location: 'North Campus', 
    occupancyPercent: 30, 
    occupancyPercentage: 30, 
    openUntil: '9:00 PM',
    isOpen: true,
    hasWifi: true,
    hasCoffee: true,
    hasOutlets: true,
    currentUsers: 45,
    capacity: 150
  },
  { 
    id: '3', 
    name: 'Coffee Shop', 
    location: 'University Ave', 
    occupancyPercent: 45, 
    occupancyPercentage: 45, 
    openUntil: '10:00 PM',
    isOpen: true,
    hasWifi: true,
    hasCoffee: true,
    hasOutlets: false,
    currentUsers: 27,
    capacity: 60
  }
];

export const LiveFeedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [whispers, setWhispers] = useState<Whisper[]>(mockWhispers);
  const [panicAlerts, setPanicAlerts] = useState<PanicAlert[]>(mockPanicAlerts);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [weather, setWeather] = useState<WeatherData | null>(mockWeather);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>(mockTrendingTopics);
  const [studySpots, setStudySpots] = useState<StudySpot[]>(mockStudySpots);
  const [finalsDate, setFinalsDate] = useState<Date | null>(new Date(2025, 7, 15)); // August 15, 2025
  const [daysUntilFinals, setDaysUntilFinals] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<LiveFeedTab>('whispers');
  const [loading, setLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(mockFeedItems);

  useEffect(() => {
    // Calculate days until finals
    if (finalsDate) {
      const today = new Date();
      const diffTime = finalsDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUntilFinals(diffDays);
    }

    // Simulate API loading
    setTimeout(() => setLoading(false), 1000);
  }, [finalsDate]);

  // Implementation of context functions
  const addWhisper = (whisper: Omit<Whisper, 'id' | 'timestamp' | 'likes' | 'comments'>) => {
    const newWhisper: Whisper = {
      ...whisper,
      id: `whisper-${Date.now()}`,
      timestamp: new Date(),
      likes: 0,
      comments: 0
    };
    setWhispers(prev => [newWhisper, ...prev]);
    
    // Also add to unified feed
    addFeedItem({
      type: 'whisper',
      anonymousId: whisper.anonymousId,
      content: whisper.content,
      mediaUrl: whisper.audioUrl,
      mediaType: 'audio',
      category: whisper.category,
      isAfterHours: whisper.isAfterHours
    });
  };

  const likeWhisper = (id: string) => {
    setWhispers(prev => 
      prev.map(whisper => 
        whisper.id === id 
          ? { ...whisper, likes: whisper.likes + 1 } 
          : whisper
      )
    );
  };

  const createPanicAlert = (alert: Omit<PanicAlert, 'id' | 'timestamp' | 'status' | 'helpersCount' | 'helpers'>) => {
    const newAlert: PanicAlert = {
      ...alert,
      id: `panic-${Date.now()}`,
      timestamp: new Date(),
      status: 'active',
      helpersCount: 0,
      helpers: []
    };
    setPanicAlerts(prev => [newAlert, ...prev]);
  };

  const helpWithPanic = (alertId: string, userId: string) => {
    setPanicAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              status: 'being-helped', 
              helpersCount: alert.helpersCount + 1,
              helpers: [...alert.helpers, userId]
            } 
          : alert
      )
    );
  };

  const createEvent = (event: Omit<Event, 'id' | 'attendees'>) => {
    const newEvent: Event = {
      ...event,
      id: `event-${Date.now()}`,
      attendees: 0
    };
    setEvents(prev => [newEvent, ...prev]);
    
    // Also add to unified feed
    addFeedItem({
      type: 'event',
      anonymousId: event.organizer,
      content: `${event.title} - ${event.description}`,
      mediaUrl: event.bannerImageUrl,
      mediaType: 'image',
      category: event.category,
      tags: [event.category, 'event']
    });
  };

  const updateStudySpotOccupancy = (id: string, occupancyPercent: number) => {
    setStudySpots(prev => 
      prev.map(spot => 
        spot.id === id ? { 
          ...spot, 
          occupancyPercent,
          occupancyPercentage: occupancyPercent,
          currentUsers: Math.round(spot.capacity * (occupancyPercent / 100))
        } : spot
      )
    );
  };

  const loadMoreFeedItems = async (): Promise<FeedItem[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate more mock items
    const newItems = generateMoreMockFeedItems(5);
    setFeedItems(prev => [...prev, ...newItems]);
    return newItems;
  };

  const addFeedItem = (item: Omit<FeedItem, 'id' | 'timestamp' | 'upvotes' | 'downvotes' | 'comments'>) => {
    const newItem: FeedItem = {
      ...item,
      id: `feed-${Date.now()}`,
      timestamp: new Date(),
      upvotes: 0,
      downvotes: 0,
      comments: []
    };
    setFeedItems(prev => [newItem, ...prev]);
  };

  const upvoteFeedItem = (id: string) => {
    setFeedItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item
      )
    );
  };

  const downvoteFeedItem = (id: string) => {
    setFeedItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, downvotes: item.downvotes + 1 } : item
      )
    );
  };

  const addCommentToFeedItem = (feedItemId: string, content: string, anonymousId: string, parentId: string = '') => {
    setFeedItems(prev => 
      prev.map(item => {
        if (item.id === feedItemId) {
          const newComment = {
            id: `comment-${Date.now()}`,
            anonymousId,
            content,
            timestamp: new Date(),
            likes: 0,
            parentId: parentId || feedItemId // Use the provided parentId (comment ID) or default to the post ID
          };
          
          // For replies to comments, we want to add them at the end to maintain chronological order
          // For top-level comments, we add them at the beginning to show newest first
          const isReplyToComment = parentId && parentId !== feedItemId;
          
          return { 
            ...item, 
            comments: isReplyToComment 
              ? [...item.comments, newComment]  // Add replies at the end
              : [newComment, ...item.comments]  // Add top-level comments at the beginning
          };
        }
        return item;
      })
    );
  };

  return (
    <LiveFeedContext.Provider value={{
      whispers,
      panicAlerts,
      events,
      weather,
      trendingTopics,
      studySpots,
      finalsDate,
      daysUntilFinals,
      activeTab,
      loading,
      feedItems,
      setActiveTab,
      addWhisper,
      likeWhisper,
      createPanicAlert,
      helpWithPanic,
      createEvent,
      updateStudySpotOccupancy,
      loadMoreFeedItems,
      addFeedItem,
      upvoteFeedItem,
      downvoteFeedItem,
      addCommentToFeedItem
    }}>
      {children}
    </LiveFeedContext.Provider>
  );
};

export const useLiveFeed = () => {
  const context = useContext(LiveFeedContext);
  if (context === undefined) {
    throw new Error('useLiveFeed must be used within a LiveFeedProvider');
  }
  return context;
};
