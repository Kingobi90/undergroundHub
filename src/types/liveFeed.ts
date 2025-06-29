export interface PanicAlert {
  id: string;
  userId: string;
  anonymousId: string; // 4-digit number
  courseCode: string;
  timestamp: Date;
  location?: string;
  status: 'active' | 'being-helped' | 'resolved';
  helpersCount: number;
  helpers: string[]; // user IDs
}

export interface Whisper {
  id: string;
  anonymousId: string;
  content: string; // Transcribed text
  audioUrl: string;
  duration: string;
  category: 'confession' | 'academic' | 'social' | 'campus-life';
  timestamp: Date;
  likes: number;
  comments: number;
  isAfterHours: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  bannerImageUrl?: string;
  organizer: string; // user ID or organization
  isOfficial: boolean;
  attendees: number;
  category: 'party' | 'academic' | 'sports' | 'culture' | 'other';
}

// Additional supporting types
export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  forecast: Array<{date: Date, condition: string, high: number, low: number}>;
}

export interface TrendingTopic {
  id: string;
  topic: string;
  popularity: number;
  trend: 'up' | 'down' | 'stable';
  relatedPosts: number;
}

export interface StudySpot {
  id: string;
  name: string;
  location: string;
  occupancyPercent: number;
  occupancyPercentage: number; // Alias for occupancyPercent
  openUntil: string;
  isOpen: boolean;
  hasWifi: boolean;
  hasCoffee: boolean;
  hasOutlets: boolean;
  currentUsers: number;
  capacity: number;
}

// New types for unified feed
export interface Comment {
  id: string;
  anonymousId: string;
  content: string;
  timestamp: Date;
  likes: number;
  parentId: string; // ID of the post or comment this is replying to
}

export type FeedItemType = 'whisper' | 'campus-uncensored' | 'mascot-reveal' | 'news' | 'event';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  anonymousId: string;
  content: string;
  mediaUrl?: string; // Can be image, video, or audio URL
  mediaType?: 'image' | 'video' | 'audio';
  timestamp: Date;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  category?: string;
  tags?: string[];
  isAfterHours?: boolean;
  isHighlighted?: boolean;
}

export interface FeedFilter {
  types: FeedItemType[];
  categories?: string[];
  tags?: string[];
  showAfterHours?: boolean;
}
