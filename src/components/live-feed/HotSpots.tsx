"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaChair, FaWifi, FaCoffee, FaBook, FaLaptop, FaChartLine, FaFilter } from 'react-icons/fa';
import Card from '../Card';

// Mock data for campus hot spots
const mockHotSpots = [
  {
    id: 'lib-3',
    name: 'Library 3rd Floor',
    currentActivity: 65, // percentage
    trend: 'rising', // rising, falling, stable
    seatsAvailable: 12,
    wifiQuality: 85,
    noiseLevel: 'Low',
    studyGroups: 3,
    prediction: 'Will be crowded in 1 hour',
    bestTimeToVisit: '9am - 11am',
    category: 'library',
    amenities: ['Power outlets', 'Standing desks', 'Private rooms'],
    image: '🏛️'
  },
  {
    id: 'lib-4',
    name: 'Library 4th Floor',
    currentActivity: 30,
    trend: 'stable',
    seatsAvailable: 45,
    wifiQuality: 90,
    noiseLevel: 'Silent',
    studyGroups: 0,
    prediction: 'Will remain quiet all day',
    bestTimeToVisit: 'Anytime',
    category: 'library',
    amenities: ['Power outlets', 'Comfortable chairs', 'Large tables'],
    image: '🏛️'
  },
  {
    id: 'union-cafe',
    name: 'Student Union Café',
    currentActivity: 85,
    trend: 'falling',
    seatsAvailable: 5,
    wifiQuality: 70,
    noiseLevel: 'High',
    studyGroups: 8,
    prediction: 'Will clear out after 2pm',
    bestTimeToVisit: '3pm - 5pm',
    category: 'cafe',
    amenities: ['Food', 'Coffee', 'Social atmosphere'],
    image: '☕'
  },
  {
    id: 'cs-lab',
    name: 'CS Building Lab',
    currentActivity: 45,
    trend: 'rising',
    seatsAvailable: 20,
    wifiQuality: 95,
    noiseLevel: 'Medium',
    studyGroups: 5,
    prediction: 'Will fill up by 7pm',
    bestTimeToVisit: 'Before 6pm',
    category: 'lab',
    amenities: ['Powerful computers', 'Specialized software', 'Tech support'],
    image: '💻'
  },
  {
    id: 'quad',
    name: 'Main Quad',
    currentActivity: 70,
    trend: 'falling',
    seatsAvailable: 'Many',
    wifiQuality: 60,
    noiseLevel: 'Medium',
    studyGroups: 12,
    prediction: 'Will clear out as temperature drops',
    bestTimeToVisit: 'Midday',
    category: 'outdoor',
    amenities: ['Fresh air', 'Natural light', 'Grass seating'],
    image: '🌳'
  },
  {
    id: 'eng-lounge',
    name: 'Engineering Lounge',
    currentActivity: 50,
    trend: 'stable',
    seatsAvailable: 15,
    wifiQuality: 85,
    noiseLevel: 'Medium',
    studyGroups: 4,
    prediction: 'Consistent activity all day',
    bestTimeToVisit: 'Mornings or evenings',
    category: 'lounge',
    amenities: ['Whiteboards', 'Project spaces', 'Vending machines'],
    image: '🔧'
  },
  {
    id: 'art-studio',
    name: 'Art Studio Commons',
    currentActivity: 25,
    trend: 'rising',
    seatsAvailable: 30,
    wifiQuality: 75,
    noiseLevel: 'Low',
    studyGroups: 2,
    prediction: 'Will remain relatively empty',
    bestTimeToVisit: 'Anytime',
    category: 'studio',
    amenities: ['Natural light', 'Large tables', 'Creative atmosphere'],
    image: '🎨'
  }
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'All Locations' },
  { id: 'library', name: 'Libraries' },
  { id: 'cafe', name: 'Cafés' },
  { id: 'lab', name: 'Labs' },
  { id: 'lounge', name: 'Lounges' },
  { id: 'outdoor', name: 'Outdoor Spaces' },
  { id: 'studio', name: 'Studios' }
];

interface HotSpotsProps {
  userId?: string;
}

const HotSpots: React.FC<HotSpotsProps> = ({ userId }) => {
  const [hotSpots, setHotSpots] = useState(mockHotSpots);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'activity' | 'seats' | 'wifi'>('activity');
  const [expandedSpot, setExpandedSpot] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle client-side rendering only
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Filter and sort hot spots
  const filteredAndSortedHotSpots = [...hotSpots]
    .filter(spot => activeCategory === 'all' || spot.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'activity') {
        return b.currentActivity - a.currentActivity;
      } else if (sortBy === 'seats') {
        if (typeof a.seatsAvailable === 'string' || typeof b.seatsAvailable === 'string') {
          return -1; // Put 'Many' at the top
        }
        return b.seatsAvailable - a.seatsAvailable;
      } else {
        return b.wifiQuality - a.wifiQuality;
      }
    });
  
  const toggleExpandSpot = (id: string) => {
    setExpandedSpot(prev => prev === id ? null : id);
  };
  
  // Activity level color
  const getActivityColor = (level: number) => {
    if (level < 30) return 'bg-green-500';
    if (level < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <span className="text-red-500">↑</span>;
      case 'falling':
        return <span className="text-green-500">↓</span>;
      default:
        return <span className="text-gray-500">→</span>;
    }
  };
  
  if (!isMounted) {
    return (
      <Card>
        <div className="h-64 flex items-center justify-center">
          <p className="text-text-secondary">Loading hot spots...</p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold">Campus Hot Spots</h3>
            <p className="text-sm text-text-secondary">
              Real-time activity levels and predictions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'activity' | 'seats' | 'wifi')}
              className="bg-primary-bg border border-gray-700 rounded px-2 py-1 text-sm text-white"
            >
              <option value="activity">Activity Level</option>
              <option value="seats">Available Seats</option>
              <option value="wifi">WiFi Quality</option>
            </select>
          </div>
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
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
        
        {/* Hot spots list */}
        <div className="space-y-4">
          {filteredAndSortedHotSpots.map(spot => (
            <div 
              key={spot.id} 
              className="bg-gray-800 rounded-lg overflow-hidden"
            >
              <div 
                className="p-4 cursor-pointer hover:bg-gray-750"
                onClick={() => toggleExpandSpot(spot.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{spot.image}</div>
                    <div>
                      <h4 className="font-medium">{spot.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <span>Activity: {spot.currentActivity}%</span>
                        <span>{getTrendIcon(spot.trend)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">Seats</div>
                      <div className="text-lg font-semibold text-accent">{spot.seatsAvailable}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">WiFi</div>
                      <div className="text-lg font-semibold text-accent">{spot.wifiQuality}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Noise</div>
                      <div className="text-lg font-semibold text-accent">{spot.noiseLevel}</div>
                    </div>
                  </div>
                </div>
                
                {/* Activity bar */}
                <div className="mt-3 bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getActivityColor(spot.currentActivity)}`}
                    style={{ width: `${spot.currentActivity}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Expanded details */}
              {expandedSpot === spot.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <div className="pt-2 border-t border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Predictions</h5>
                        <p className="text-sm text-text-secondary">{spot.prediction}</p>
                        <p className="text-sm text-text-secondary mt-1">Best time to visit: {spot.bestTimeToVisit}</p>
                        
                        <h5 className="text-sm font-medium mt-3 mb-2">Study Groups</h5>
                        <p className="text-sm text-text-secondary">{spot.studyGroups} active groups</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Amenities</h5>
                        <ul className="text-sm text-text-secondary">
                          {spot.amenities.map((amenity, index) => (
                            <li key={index} className="flex items-center gap-2 mb-1">
                              <span className="text-accent">•</span> {amenity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <button className="text-sm text-accent hover:underline">
                        View on Campus Map
                      </button>
                      <button className="text-sm text-accent hover:underline">
                        Set Alert for Open Seats
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </Card>
      
      {/* Crowdsourcing card */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Help Improve Predictions</h3>
            <p className="text-sm text-text-secondary mt-1">
              Report current conditions at your location to help others
            </p>
          </div>
          <button className="px-4 py-2 bg-accent text-black rounded-md font-medium hover:bg-yellow-400 transition-colors">
            Report Now
          </button>
        </div>
      </Card>
      
      {/* Weekly patterns */}
      <Card>
        <h3 className="text-lg font-medium mb-3">Weekly Patterns</h3>
        <div className="space-y-3">
          <div className="bg-gray-800 p-3 rounded-lg">
            <h4 className="font-medium">Library 3rd Floor</h4>
            <p className="text-sm text-text-secondary">Busiest on Sundays and Mondays, quietest on Fridays</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <h4 className="font-medium">Student Union Café</h4>
            <p className="text-sm text-text-secondary">Peak hours are 11am-1pm, best to avoid during lunch rush</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <h4 className="font-medium">CS Building Lab</h4>
            <p className="text-sm text-text-secondary">Fills up quickly after 6pm on weekdays, especially before project deadlines</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HotSpots;
