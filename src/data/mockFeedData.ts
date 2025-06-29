import { FeedItem, Comment } from '@/types/liveFeed';

// Helper function to create dates relative to now
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const hoursAgo = (hours: number): Date => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
};

const minutesAgo = (minutes: number): Date => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date;
};

// Mock comments
const mockComments: Record<string, Comment[]> = {
  post1: [
    {
      id: 'comment1',
      anonymousId: '4321',
      content: 'This is so cool! Can\'t wait to see it in person!',
      timestamp: hoursAgo(2),
      likes: 24,
      parentId: 'post1'
    },
    {
      id: 'comment2',
      anonymousId: '8765',
      content: 'The design team really outdid themselves this time.',
      timestamp: hoursAgo(1),
      likes: 18,
      parentId: 'post1'
    }
  ],
  post2: [
    {
      id: 'comment3',
      anonymousId: '2468',
      content: 'I was there! The professor didn\'t even notice!',
      timestamp: minutesAgo(45),
      likes: 32,
      parentId: 'post2'
    }
  ],
  post3: [
    {
      id: 'comment4',
      anonymousId: '1357',
      content: 'This is why I always bring my own coffee to campus.',
      timestamp: hoursAgo(3),
      likes: 41,
      parentId: 'post3'
    },
    {
      id: 'comment5',
      anonymousId: '9753',
      content: 'The prices are ridiculous too!',
      timestamp: hoursAgo(2),
      likes: 28,
      parentId: 'post3'
    },
    {
      id: 'comment6',
      anonymousId: '3579',
      content: 'Try the coffee shop on 5th street instead, much better quality.',
      timestamp: minutesAgo(30),
      likes: 15,
      parentId: 'post3'
    }
  ],
  post5: [
    {
      id: 'comment7',
      anonymousId: '6543',
      content: 'I\'m so nervous about this final!',
      timestamp: hoursAgo(5),
      likes: 12,
      parentId: 'post5'
    },
    {
      id: 'comment8',
      anonymousId: '7890',
      content: 'Don\'t worry, just focus on the practice problems from last week.',
      timestamp: hoursAgo(4),
      likes: 19,
      parentId: 'post5'
    }
  ],
  post8: [
    {
      id: 'comment9',
      anonymousId: '2345',
      content: 'I\'ve been waiting for this all semester!',
      timestamp: daysAgo(1),
      likes: 27,
      parentId: 'post8'
    }
  ]
};

// Mock feed items
export const mockFeedItems: FeedItem[] = [
  {
    id: 'post1',
    type: 'mascot-reveal',
    anonymousId: '1234',
    content: 'BREAKING: Just got a sneak peek of the new Stingers mascot design! It looks AMAZING! The reveal event is this Friday at the quad.',
    mediaUrl: '/images/stingers-mascot.png',
    mediaType: 'image',
    timestamp: hoursAgo(4),
    upvotes: 156,
    downvotes: 3,
    comments: mockComments.post1,
    tags: ['mascot', 'stingers', 'campus-event'],
    isHighlighted: true
  },
  {
    id: 'post2',
    type: 'campus-uncensored',
    anonymousId: '5678',
    content: 'Someone just walked into Calculus 101 with a full pizza and started handing out slices to everyone. The professor was so confused!',
    timestamp: hoursAgo(6),
    upvotes: 89,
    downvotes: 2,
    comments: mockComments.post2,
    tags: ['funny', 'class', 'food']
  },
  {
    id: 'post3',
    type: 'campus-uncensored',
    anonymousId: '9012',
    content: 'The coffee at the campus center tastes like dishwater today. Avoid at all costs!',
    timestamp: hoursAgo(8),
    upvotes: 67,
    downvotes: 12,
    comments: mockComments.post3,
    tags: ['food', 'warning', 'campus-center']
  },
  {
    id: 'post4',
    type: 'whisper',
    anonymousId: '3456',
    content: 'I\'ve been pretending to understand the material all semester, but I\'m completely lost. Finals are next week and I\'m freaking out.',
    mediaUrl: '/audio/whisper1.mp3',
    mediaType: 'audio',
    timestamp: daysAgo(1),
    upvotes: 124,
    downvotes: 0,
    comments: [],
    category: 'academic',
    isAfterHours: false
  },
  {
    id: 'post5',
    type: 'campus-uncensored',
    anonymousId: '7890',
    content: 'Study group for Professor Johnson\'s Organic Chemistry final forming in the library, 3rd floor, right now! We have snacks!',
    timestamp: hoursAgo(2),
    upvotes: 45,
    downvotes: 0,
    comments: mockComments.post5,
    tags: ['study', 'finals', 'chemistry']
  },
  {
    id: 'post6',
    type: 'whisper',
    anonymousId: '2345',
    content: 'I think I\'m falling for my roommate\'s girlfriend. I would never act on it, but it\'s making things really awkward.',
    mediaUrl: '/audio/whisper2.mp3',
    mediaType: 'audio',
    timestamp: daysAgo(2),
    upvotes: 78,
    downvotes: 5,
    comments: [],
    category: 'confession',
    isAfterHours: true
  },
  {
    id: 'post7',
    type: 'news',
    anonymousId: 'admin',
    content: 'Campus WiFi will be down for maintenance tonight from 2AM to 4AM. Plan accordingly!',
    timestamp: hoursAgo(12),
    upvotes: 34,
    downvotes: 67,
    comments: [],
    category: 'announcement',
    isHighlighted: true
  },
  {
    id: 'post8',
    type: 'event',
    anonymousId: 'events',
    content: 'End of Semester Beach Party this Saturday! Free food, music, and games. Starts at 7PM at Sunset Beach.',
    mediaUrl: '/images/beach-party.jpg',
    mediaType: 'image',
    timestamp: daysAgo(3),
    upvotes: 210,
    downvotes: 0,
    comments: mockComments.post8,
    category: 'party',
    tags: ['party', 'weekend', 'beach']
  },
  {
    id: 'post9',
    type: 'mascot-reveal',
    anonymousId: 'campus',
    content: 'The Stingers mascot costume is being made by the same company that does professional sports team mascots! Quality is going to be top-notch.',
    timestamp: daysAgo(5),
    upvotes: 89,
    downvotes: 4,
    comments: [],
    tags: ['mascot', 'stingers']
  },
  {
    id: 'post10',
    type: 'campus-uncensored',
    anonymousId: '6789',
    content: 'Just saw two professors arguing about parking spots in the faculty lot. It got heated! 👀',
    timestamp: minutesAgo(30),
    upvotes: 23,
    downvotes: 1,
    comments: [],
    tags: ['faculty', 'drama', 'parking']
  }
];

// Function to generate more mock data for infinite scroll
export const generateMoreMockFeedItems = (count: number = 5): FeedItem[] => {
  const types: Array<FeedItem['type']> = ['whisper', 'campus-uncensored', 'mascot-reveal', 'news', 'event'];
  const result: FeedItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const id = `generated-${Date.now()}-${i}`;
    const anonymousId = Math.floor(1000 + Math.random() * 9000).toString();
    
    let content = '';
    let mediaUrl: string | undefined;
    let mediaType: 'image' | 'video' | 'audio' | undefined;
    let category: string | undefined;
    let isAfterHours = Math.random() > 0.8;
    
    switch (type) {
      case 'whisper':
        content = [
          'I cheated on my midterm and now I feel terrible about it.',
          'I\'ve been skipping all my 8AM classes this semester.',
          'I\'m the one who\'s been leaving encouraging sticky notes in the library study rooms.',
          'I pretend to be busy when I see people from my classes around campus.'
        ][Math.floor(Math.random() * 4)];
        mediaUrl = '/audio/whisper-generated.mp3';
        mediaType = 'audio';
        category = ['confession', 'academic', 'social', 'campus-life'][Math.floor(Math.random() * 4)];
        break;
        
      case 'campus-uncensored':
        content = [
          'The vending machine on the 2nd floor of the science building gives out two snacks sometimes if you press B5.',
          'Someone brought their cat to class today and it slept on the professor\'s laptop.',
          'The line at the campus coffee shop was so long today that people were studying while waiting.',
          'Found a secret study spot in the old library wing that nobody knows about!'
        ][Math.floor(Math.random() * 4)];
        break;
        
      case 'mascot-reveal':
        content = [
          'Heard the mascot will have special effects built into the costume!',
          'The mascot design was chosen from over 200 student submissions.',
          'There\'s going to be a special dance routine at the mascot reveal event.',
          'The mascot will have a custom entrance song composed by the music department.'
        ][Math.floor(Math.random() * 4)];
        if (Math.random() > 0.5) {
          mediaUrl = '/images/mascot-teaser.jpg';
          mediaType = 'image';
        }
        break;
        
      case 'news':
        content = [
          'Library extending hours during finals week. Open 24/7 starting Monday!',
          'New food truck arriving on campus next week - serving authentic Thai food.',
          'Campus shuttle route changing due to construction. Check the app for updates.',
          'Free printing in the computer lab this week, sponsored by the Student Council.'
        ][Math.floor(Math.random() * 4)];
        category = 'announcement';
        break;
        
      case 'event':
        content = [
          'Karaoke Night at the Student Union this Thursday, 8PM-11PM.',
          'Resume Workshop in Room 302B tomorrow at 3PM. Bring your resume for review!',
          'Outdoor Movie Night on the quad this Friday. Movie starts at sunset!',
          'Stress Relief Day: Free massages and therapy dogs in the wellness center.'
        ][Math.floor(Math.random() * 4)];
        if (Math.random() > 0.7) {
          mediaUrl = '/images/event-generic.jpg';
          mediaType = 'image';
        }
        category = ['party', 'academic', 'culture', 'other'][Math.floor(Math.random() * 4)];
        break;
    }
    
    result.push({
      id,
      type,
      anonymousId,
      content,
      mediaUrl,
      mediaType,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
      upvotes: Math.floor(Math.random() * 100),
      downvotes: Math.floor(Math.random() * 10),
      comments: [],
      category,
      tags: type === 'campus-uncensored' ? ['campus', 'student-life'] : undefined,
      isAfterHours,
      isHighlighted: Math.random() > 0.9
    });
  }
  
  return result;
};
