"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaPlay, FaPause, FaHeart, FaShare, FaEllipsisH } from 'react-icons/fa';
import Card from '../Card';

// Mock data for Stories from the Quad
const mockStories = [
  {
    id: 's1',
    title: "Finals Week Confession",
    content: "I've been living in the library for three days straight. I've memorized every crack in the ceiling of the third floor study room. The barista at the coffee shop knows my order by heart now. I think I'm starting to hallucinate formulas floating in the air.",
    duration: "1:24",
    likes: 42,
    category: "confession",
    timestamp: "2 hours ago",
    isPlaying: false,
    audioUrl: "/audio/story1.mp3", // This would be a real audio file in production
    anonymousName: "Sleepy Owl",
    anonymousAvatar: "🦉"
  },
  {
    id: 's2',
    title: "That Awkward Moment in Chem Lab",
    content: "When the professor asked me to demonstrate the experiment and I had no idea what I was doing. I mixed the wrong chemicals and turned the solution bright purple instead of clear. The TA's face was priceless. The whole class erupted in laughter when the professor said 'Well, that's one way to make grape juice.'",
    duration: "2:15",
    likes: 78,
    category: "funny",
    timestamp: "5 hours ago",
    isPlaying: false,
    audioUrl: "/audio/story2.mp3",
    anonymousName: "Clumsy Panda",
    anonymousAvatar: "🐼"
  },
  {
    id: 's3',
    title: "Late Night Library Encounter",
    content: "I was studying at 2am when someone offered me coffee. We ended up talking for hours about everything from quantum physics to our favorite cereal. Never got their name or number. If you're the person with the Star Wars thermos and the infectious laugh, I'd love to meet again.",
    duration: "1:47",
    likes: 103,
    category: "campus",
    timestamp: "Yesterday",
    isPlaying: false,
    audioUrl: "/audio/story3.mp3",
    anonymousName: "Curious Fox",
    anonymousAvatar: "🦊"
  },
  {
    id: 's4',
    title: "Professor's Secret Talent",
    content: "Just discovered my calculus professor is a semi-professional DJ on weekends. Spotted him at the club downtown absolutely killing it on the turntables. Now I can't unsee him dropping beats instead of equations during lectures.",
    duration: "1:32",
    likes: 215,
    category: "funny",
    timestamp: "2 days ago",
    isPlaying: false,
    audioUrl: "/audio/story4.mp3",
    anonymousName: "Dancing Tiger",
    anonymousAvatar: "🐯"
  }
];

// Categories for stories
const storyCategories = [
  { id: 'all', name: 'All Stories' },
  { id: 'confession', name: 'Confessions' },
  { id: 'funny', name: 'Funny Moments' },
  { id: 'campus', name: 'Campus Life' },
  { id: 'academic', name: 'Academic Struggles' }
];

interface StoriesFromQuadProps {
  userId?: string;
}

const StoriesFromQuad: React.FC<StoriesFromQuadProps> = ({ userId }) => {
  const [stories, setStories] = useState(mockStories);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [expandedStory, setExpandedStory] = useState<string | null>(null);
  
  // Handle client-side rendering only
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Recording timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => clearInterval(interval);
  }, [isRecording]);
  
  const togglePlayStory = (id: string) => {
    setStories(prev => 
      prev.map(story => 
        story.id === id 
          ? { ...story, isPlaying: !story.isPlaying } 
          : { ...story, isPlaying: false }
      )
    );
  };
  
  const toggleExpandStory = (id: string) => {
    setExpandedStory(prev => prev === id ? null : id);
  };
  
  const startRecording = () => {
    // In a real implementation, this would use the Web Audio API
    // to start recording the user's voice
    setIsRecording(true);
  };
  
  const stopRecording = () => {
    // In a real implementation, this would stop recording
    // and process the audio file
    setIsRecording(false);
    
    // Generate a random anonymous identity
    const anonymousNames = ["Sleepy Owl", "Curious Fox", "Dancing Tiger", "Clever Rabbit", "Wise Turtle"];
    const anonymousAvatars = ["🦉", "🦊", "🐯", "🐰", "🐢"];
    const randomIndex = Math.floor(Math.random() * anonymousNames.length);
    
    // Mock adding a new story
    const newStory = {
      id: `s${stories.length + 1}`,
      title: "Your New Story",
      content: "Tap to listen to your recording...",
      duration: `0:${recordingTime < 10 ? '0' + recordingTime : recordingTime}`,
      likes: 0,
      category: "confession",
      timestamp: "Just now",
      isPlaying: false,
      audioUrl: "/audio/new-story.mp3", // This would be the actual recorded audio
      anonymousName: anonymousNames[randomIndex],
      anonymousAvatar: anonymousAvatars[randomIndex]
    };
    
    setStories(prev => [newStory, ...prev]);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  const likeStory = (id: string) => {
    setStories(prev => 
      prev.map(story => 
        story.id === id 
          ? { ...story, likes: story.likes + 1 } 
          : story
      )
    );
  };
  
  const filteredStories = activeCategory === 'all' 
    ? stories 
    : stories.filter(story => story.category === activeCategory);
  
  if (!isMounted) {
    return (
      <Card>
        <div className="h-64 flex items-center justify-center">
          <p className="text-text-secondary">Loading stories...</p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold">Stories from the Quad</h3>
            <p className="text-sm text-text-secondary">
              Anonymous voice stories from around campus
            </p>
          </div>
          {!isRecording ? (
            <button 
              onClick={startRecording}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
            >
              <FaMicrophone /> Record Your Story
            </button>
          ) : (
            <button 
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full animate-pulse"
            >
              <FaMicrophone className="text-red-500" /> Recording... {formatTime(recordingTime)}
            </button>
          )}
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {storyCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                activeCategory === category.id 
                  ? 'bg-accent text-black' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Weekly featured stories */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Weekly Highlights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStories.slice(0, 2).map(story => (
              <div 
                key={`featured-${story.id}`} 
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{story.anonymousAvatar}</div>
                  <div className="flex-1">
                    <h5 className="font-medium">{story.title}</h5>
                    <p className="text-sm text-text-secondary mb-2">{story.anonymousName}</p>
                    <p className="text-sm line-clamp-2">{story.content}</p>
                    <div className="flex justify-between items-center mt-3">
                      <button 
                        onClick={() => togglePlayStory(story.id)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                          story.isPlaying ? 'bg-accent text-black' : 'bg-gray-700 text-white'
                        }`}
                      >
                        {story.isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />} {story.duration}
                      </button>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => likeStory(story.id)}
                          className="text-text-secondary hover:text-accent"
                        >
                          <FaHeart size={14} />
                        </button>
                        <span className="text-xs text-text-secondary">{story.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* All stories list */}
        <div>
          <h4 className="text-lg font-medium mb-3">Recent Stories</h4>
          <div className="space-y-3">
            {filteredStories.map(story => (
              <div 
                key={story.id} 
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{story.anonymousAvatar}</div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h5 className="font-medium">{story.title}</h5>
                      <span className="text-xs text-text-secondary">{story.timestamp}</span>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{story.anonymousName}</p>
                    <motion.div
                      animate={{ height: expandedStory === story.id ? 'auto' : '2.5rem' }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm">{story.content}</p>
                    </motion.div>
                    {story.content.length > 100 && (
                      <button 
                        onClick={() => toggleExpandStory(story.id)}
                        className="text-xs text-accent mt-1"
                      >
                        {expandedStory === story.id ? 'Show less' : 'Show more'}
                      </button>
                    )}
                    <div className="flex justify-between items-center mt-3">
                      <button 
                        onClick={() => togglePlayStory(story.id)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                          story.isPlaying ? 'bg-accent text-black' : 'bg-gray-700 text-white'
                        }`}
                      >
                        {story.isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />} {story.duration}
                      </button>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => likeStory(story.id)}
                            className="text-text-secondary hover:text-accent"
                          >
                            <FaHeart size={14} />
                          </button>
                          <span className="text-xs text-text-secondary">{story.likes}</span>
                        </div>
                        <button className="text-text-secondary hover:text-white">
                          <FaShare size={14} />
                        </button>
                        <button className="text-text-secondary hover:text-white">
                          <FaEllipsisH size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      {/* Weekly compilation promo */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">This Week's Compilation</h3>
            <p className="text-sm text-text-secondary mt-1">
              The best stories from this week, curated by our team
            </p>
          </div>
          <button className="px-4 py-2 bg-accent text-black rounded-md font-medium hover:bg-yellow-400 transition-colors">
            Listen Now
          </button>
        </div>
      </Card>
    </div>
  );
};

export default StoriesFromQuad;
