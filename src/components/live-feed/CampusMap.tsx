"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaUserAlt, FaUsers, FaBook, FaCoffee, FaLaptop, FaInfoCircle } from 'react-icons/fa';
import Card from '../Card';

// Mock campus locations
const campusLocations = [
  { id: 'lib', name: 'Main Library', x: 150, y: 100, icon: <FaBook />, color: 'bg-blue-500', description: 'Four floors of study spaces, books, and resources.' },
  { id: 'union', name: 'Student Union', x: 300, y: 200, icon: <FaUsers />, color: 'bg-green-500', description: 'Food court, student organizations, and event spaces.' },
  { id: 'cafe', name: 'Campus Café', x: 200, y: 300, icon: <FaCoffee />, color: 'bg-yellow-500', description: 'Coffee, snacks, and a cozy study atmosphere.' },
  { id: 'cs', name: 'Computer Science Building', x: 400, y: 120, icon: <FaLaptop />, color: 'bg-purple-500', description: 'Labs, classrooms, and tech support.' },
  { id: 'quad', name: 'Main Quad', x: 250, y: 250, icon: <FaUsers />, color: 'bg-red-500', description: 'Central gathering space for events and hanging out.' },
  { id: 'dorm1', name: 'North Dorms', x: 100, y: 350, icon: <FaUsers />, color: 'bg-indigo-500', description: 'Freshman housing and community spaces.' },
  { id: 'dorm2', name: 'South Dorms', x: 350, y: 350, icon: <FaUsers />, color: 'bg-pink-500', description: 'Upperclassman housing with study lounges.' },
  { id: 'gym', name: 'Recreation Center', x: 450, y: 250, icon: <FaUsers />, color: 'bg-orange-500', description: 'Gym, pool, and fitness classes.' },
];

// Mock active users
const mockActiveUsers = [
  { id: 'u1', name: 'Anonymous Fox', location: 'lib', avatar: '🦊', status: 'studying' },
  { id: 'u2', name: 'Anonymous Owl', location: 'cafe', avatar: '🦉', status: 'chilling' },
  { id: 'u3', name: 'Anonymous Panda', location: 'cs', avatar: '🐼', status: 'coding' },
  { id: 'u4', name: 'Anonymous Tiger', location: 'union', avatar: '🐯', status: 'meeting' },
  { id: 'u5', name: 'Anonymous Rabbit', location: 'quad', avatar: '🐰', status: 'hanging out' },
  { id: 'u6', name: 'Anonymous Turtle', location: 'dorm1', avatar: '🐢', status: 'studying' },
  { id: 'u7', name: 'Anonymous Bear', location: 'gym', avatar: '🐻', status: 'working out' },
];

// Status options
const statusOptions = [
  { value: 'studying', label: 'Studying' },
  { value: 'chilling', label: 'Chilling' },
  { value: 'need help', label: 'Need Help' },
  { value: 'giving help', label: 'Giving Help' },
  { value: 'meeting', label: 'Meeting Friends' },
  { value: 'eating', label: 'Eating' },
  { value: 'working out', label: 'Working Out' },
];

interface CampusMapProps {
  userId?: string;
}

const CampusMap: React.FC<CampusMapProps> = ({ userId }) => {
  const [activeUsers, setActiveUsers] = useState(mockActiveUsers);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string>('studying');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle client-side rendering only
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const checkInToLocation = (locationId: string) => {
    setUserLocation(locationId);
    setSelectedLocation(locationId);
    
    // Generate a random anonymous identity
    const anonymousNames = ["Sleepy Owl", "Curious Fox", "Dancing Tiger", "Clever Rabbit", "Wise Turtle", "Happy Bear", "Sneaky Cat"];
    const anonymousAvatars = ["🦉", "🦊", "🐯", "🐰", "🐢", "🐻", "🐱"];
    const randomIndex = Math.floor(Math.random() * anonymousNames.length);
    
    // In a real app, this would update the server
    // For now, we'll just update the local state
    const updatedUsers = activeUsers.filter(user => user.id !== 'currentUser');
    updatedUsers.push({
      id: 'currentUser',
      name: anonymousNames[randomIndex],
      location: locationId,
      avatar: anonymousAvatars[randomIndex],
      status: userStatus
    });
    
    setActiveUsers(updatedUsers);
  };
  
  const getUsersAtLocation = (locationId: string) => {
    return activeUsers.filter(user => user.location === locationId);
  };
  
  const getLocationDetails = (locationId: string | null) => {
    if (!locationId) return null;
    return campusLocations.find(loc => loc.id === locationId);
  };
  
  if (!isMounted) {
    return (
      <Card>
        <div className="h-64 flex items-center justify-center">
          <p className="text-text-secondary">Loading campus map...</p>
        </div>
      </Card>
    );
  }
  
  const selectedLocationDetails = getLocationDetails(selectedLocation);
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold">Digital Campus</h3>
            <p className="text-sm text-text-secondary">
              See where everyone is and check in to locations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Your Status:</span>
            <select
              value={userStatus}
              onChange={(e) => setUserStatus(e.target.value)}
              className="bg-primary-bg border border-gray-700 rounded px-2 py-1 text-sm text-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="relative w-full h-[400px] bg-gray-900 rounded-lg border border-gray-800 overflow-hidden mb-4">
          {/* Campus map background */}
          <div className="absolute inset-0">
            {/* Simple campus layout visualization */}
            <div className="absolute top-[50px] left-[100px] w-[100px] h-[80px] bg-blue-900 bg-opacity-20 border border-blue-800 rounded"></div>
            <div className="absolute top-[180px] left-[280px] w-[80px] h-[60px] bg-green-900 bg-opacity-20 border border-green-800 rounded"></div>
            <div className="absolute top-[280px] left-[180px] w-[60px] h-[60px] bg-yellow-900 bg-opacity-20 border border-yellow-800 rounded"></div>
            <div className="absolute top-[100px] left-[380px] w-[80px] h-[60px] bg-purple-900 bg-opacity-20 border border-purple-800 rounded"></div>
            <div className="absolute top-[230px] left-[230px] w-[60px] h-[60px] bg-red-900 bg-opacity-20 border border-red-800 rounded-full"></div>
            <div className="absolute top-[330px] left-[80px] w-[80px] h-[60px] bg-indigo-900 bg-opacity-20 border border-indigo-800 rounded"></div>
            <div className="absolute top-[330px] left-[330px] w-[80px] h-[60px] bg-pink-900 bg-opacity-20 border border-pink-800 rounded"></div>
            <div className="absolute top-[230px] left-[430px] w-[60px] h-[60px] bg-orange-900 bg-opacity-20 border border-orange-800 rounded"></div>
            
            {/* Paths connecting locations */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
              <line x1="150" y1="100" x2="250" y2="250" stroke="#4B5563" strokeWidth="2" />
              <line x1="300" y1="200" x2="250" y2="250" stroke="#4B5563" strokeWidth="2" />
              <line x1="200" y1="300" x2="250" y2="250" stroke="#4B5563" strokeWidth="2" />
              <line x1="400" y1="120" x2="250" y2="250" stroke="#4B5563" strokeWidth="2" />
              <line x1="100" y1="350" x2="250" y2="250" stroke="#4B5563" strokeWidth="2" />
              <line x1="350" y1="350" x2="250" y2="250" stroke="#4B5563" strokeWidth="2" />
              <line x1="450" y1="250" x2="250" y2="250" stroke="#4B5563" strokeWidth="2" />
            </svg>
          </div>
          
          {/* Campus locations */}
          {campusLocations.map(location => (
            <div 
              key={location.id}
              className="absolute"
              style={{ top: `${location.y}px`, left: `${location.x}px`, zIndex: 10 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  checkInToLocation(location.id);
                  setSelectedLocation(location.id);
                }}
                className={`${location.color} p-2 rounded-full text-white ${
                  userLocation === location.id ? 'ring-2 ring-accent ring-offset-2 ring-offset-gray-900' : ''
                }`}
                title={`Check in at ${location.name}`}
              >
                {location.icon}
              </motion.button>
              
              {/* Location name */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                <span className="text-xs font-medium text-white bg-gray-800 bg-opacity-75 px-1 rounded">
                  {location.name}
                </span>
              </div>
              
              {/* Users at this location */}
              <div className="absolute top-0 right-0 transform translate-x-full -translate-y-1/2">
                {getUsersAtLocation(location.id).map((user, index) => (
                  <div 
                    key={user.id}
                    className="inline-block ml-1"
                    title={`${user.name} is ${user.status} here`}
                  >
                    <span className="text-lg">{user.avatar}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Location details */}
        {selectedLocationDetails && (
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <div className={`${selectedLocationDetails.color} p-2 rounded-full text-white`}>
                {selectedLocationDetails.icon}
              </div>
              <div>
                <h4 className="font-medium">{selectedLocationDetails.name}</h4>
                <p className="text-sm text-text-secondary mt-1">{selectedLocationDetails.description}</p>
                
                <div className="mt-3">
                  <h5 className="text-sm font-medium flex items-center gap-1">
                    <FaUsers className="text-accent" /> People Here ({getUsersAtLocation(selectedLocationDetails.id).length})
                  </h5>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getUsersAtLocation(selectedLocationDetails.id).map(user => (
                      <div 
                        key={user.id}
                        className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        <span>{user.avatar}</span>
                        <span>{user.name}</span>
                        <span className="text-text-secondary">•</span>
                        <span className="text-accent">{user.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Active users list */}
        <div>
          <h4 className="text-sm font-medium mb-2">Active Now ({activeUsers.length})</h4>
          <div className="flex flex-wrap gap-2">
            {activeUsers.map(user => (
              <div 
                key={user.id}
                className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full text-xs"
              >
                <span>{user.avatar}</span>
                <span>{user.name}</span>
                <span className="text-text-secondary">@</span>
                <span className="text-accent">{
                  campusLocations.find(loc => loc.id === user.location)?.name
                }</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      {/* AR Feature Promo */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FaInfoCircle className="text-accent" /> Coming Soon: AR Campus View
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Point your camera at buildings to see who's inside and what's happening
            </p>
          </div>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-md font-medium opacity-50 cursor-not-allowed">
            Join Waitlist
          </button>
        </div>
      </Card>
    </div>
  );
};

export default CampusMap;
