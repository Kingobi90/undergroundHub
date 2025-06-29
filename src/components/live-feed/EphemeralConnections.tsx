"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaUsers, FaComments, FaPlus, FaChevronRight } from 'react-icons/fa';
import Card from '../Card';

// Mock data for ephemeral connections
const mockConnections = [
  {
    id: 'c1',
    name: 'CS 101 Study Group',
    description: 'Cramming for tomorrow\'s midterm. All welcome!',
    participants: 8,
    expiresIn: '5 hours',
    category: 'class',
    tags: ['Computer Science', 'Midterm', 'Algorithms'],
    messages: 24,
    lastActive: '2 minutes ago',
    anonymousNames: ['Curious Fox', 'Clever Rabbit', 'Wise Turtle']
  },
  {
    id: 'c2',
    name: 'Calculus II Help',
    description: 'Stuck on integration techniques. Can anyone help?',
    participants: 3,
    expiresIn: '2 hours',
    category: 'class',
    tags: ['Math', 'Calculus', 'Homework'],
    messages: 15,
    lastActive: '5 minutes ago',
    anonymousNames: ['Dancing Tiger', 'Sleepy Owl']
  },
  {
    id: 'c3',
    name: 'Campus Concert Meetup',
    description: 'Meeting at the quad before tonight\'s show',
    participants: 12,
    expiresIn: '3 hours',
    category: 'event',
    tags: ['Music', 'Social', 'Weekend'],
    messages: 47,
    lastActive: 'Just now',
    anonymousNames: ['Happy Bear', 'Sneaky Cat', 'Dancing Tiger']
  },
  {
    id: 'c4',
    name: 'Psychology Paper Review',
    description: 'Peer reviewing each other\'s papers before submission',
    participants: 5,
    expiresIn: '8 hours',
    category: 'class',
    tags: ['Psychology', 'Papers', 'Peer Review'],
    messages: 31,
    lastActive: '15 minutes ago',
    anonymousNames: ['Wise Turtle', 'Curious Fox']
  },
  {
    id: 'c5',
    name: 'Dining Hall Dinner Group',
    description: 'Meeting for dinner at 6pm. Looking for more people!',
    participants: 4,
    expiresIn: '1 hour',
    category: 'social',
    tags: ['Food', 'Social', 'Dinner'],
    messages: 19,
    lastActive: '3 minutes ago',
    anonymousNames: ['Clever Rabbit', 'Sleepy Owl']
  }
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'All Connections' },
  { id: 'class', name: 'Classes' },
  { id: 'event', name: 'Events' },
  { id: 'social', name: 'Social' },
  { id: 'study', name: 'Study Groups' }
];

interface EphemeralConnectionsProps {
  userId?: string;
}

const EphemeralConnections: React.FC<EphemeralConnectionsProps> = ({ userId }) => {
  const [connections, setConnections] = useState(mockConnections);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  const [showNewConnectionForm, setShowNewConnectionForm] = useState(false);
  const [newConnection, setNewConnection] = useState({
    name: '',
    description: '',
    category: 'class',
    tags: '',
    expiresIn: '24 hours'
  });
  
  // Handle client-side rendering only
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const filteredConnections = activeCategory === 'all' 
    ? connections 
    : connections.filter(conn => conn.category === activeCategory);
  
  const handleCreateConnection = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a random anonymous identity
    const anonymousNames = ["Sleepy Owl", "Curious Fox", "Dancing Tiger", "Clever Rabbit", "Wise Turtle"];
    const randomIndex = Math.floor(Math.random() * anonymousNames.length);
    
    // Create new connection
    const newConnectionObj = {
      id: `c${connections.length + 1}`,
      name: newConnection.name,
      description: newConnection.description,
      participants: 1,
      expiresIn: newConnection.expiresIn,
      category: newConnection.category as 'class' | 'event' | 'social' | 'study',
      tags: newConnection.tags.split(',').map(tag => tag.trim()),
      messages: 0,
      lastActive: 'Just now',
      anonymousNames: [anonymousNames[randomIndex]]
    };
    
    setConnections([newConnectionObj, ...connections]);
    setShowNewConnectionForm(false);
    setNewConnection({
      name: '',
      description: '',
      category: 'class',
      tags: '',
      expiresIn: '24 hours'
    });
  };
  
  const joinConnection = (id: string) => {
    // In a real app, this would connect to a chat room
    // For now, we'll just update the UI
    setConnections(prev => 
      prev.map(conn => 
        conn.id === id 
          ? { ...conn, participants: conn.participants + 1 } 
          : conn
      )
    );
  };
  
  if (!isMounted) {
    return (
      <Card>
        <div className="h-64 flex items-center justify-center">
          <p className="text-text-secondary">Loading connections...</p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold">Ephemeral Connections</h3>
            <p className="text-sm text-text-secondary">
              Time-limited chat rooms that expire in 24 hours
            </p>
          </div>
          <button 
            onClick={() => setShowNewConnectionForm(!showNewConnectionForm)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-md"
          >
            <FaPlus /> Create Connection
          </button>
        </div>
        
        {/* New connection form */}
        {showNewConnectionForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6"
          >
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-medium mb-3">Create New Connection</h4>
              <form onSubmit={handleCreateConnection}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={newConnection.name}
                      onChange={(e) => setNewConnection({...newConnection, name: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Give your connection a name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={newConnection.category}
                      onChange={(e) => setNewConnection({...newConnection, category: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      <option value="class">Class</option>
                      <option value="event">Event</option>
                      <option value="social">Social</option>
                      <option value="study">Study Group</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newConnection.description}
                    onChange={(e) => setNewConnection({...newConnection, description: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="What's this connection about?"
                    rows={2}
                    required
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={newConnection.tags}
                      onChange={(e) => setNewConnection({...newConnection, tags: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Math, Homework, Study"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Expires In</label>
                    <select
                      value={newConnection.expiresIn}
                      onChange={(e) => setNewConnection({...newConnection, expiresIn: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      <option value="1 hour">1 hour</option>
                      <option value="3 hours">3 hours</option>
                      <option value="6 hours">6 hours</option>
                      <option value="12 hours">12 hours</option>
                      <option value="24 hours">24 hours</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewConnectionForm(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-accent text-black rounded-md"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
        
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
        
        {/* Connections list */}
        <div className="space-y-4">
          {filteredConnections.length > 0 ? (
            filteredConnections.map(connection => (
              <div 
                key={connection.id} 
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{connection.name}</h4>
                      <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-text-secondary">
                        {connection.category}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{connection.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-xs text-text-secondary">
                        <FaClock /> Expires in {connection.expiresIn}
                      </div>
                      <div className="flex items-center justify-end gap-1 text-xs text-text-secondary mt-1">
                        <FaUsers /> {connection.participants} participants
                      </div>
                    </div>
                    <button
                      onClick={() => joinConnection(connection.id)}
                      className="ml-4 px-3 py-1.5 bg-accent text-black rounded-md text-sm font-medium hover:bg-yellow-400 transition-colors"
                    >
                      Join
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-1">
                  {connection.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="mt-3 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1 text-text-secondary">
                    <FaComments /> {connection.messages} messages
                  </div>
                  <div className="text-text-secondary">
                    Active {connection.lastActive}
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text-secondary">People here:</span>
                    <div className="flex -space-x-2">
                      {connection.anonymousNames.map((name, index) => (
                        <div 
                          key={index}
                          className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs"
                          title={name}
                        >
                          {name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-text-secondary">
                      {connection.participants > connection.anonymousNames.length && 
                        `+${connection.participants - connection.anonymousNames.length} more`}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-text-secondary">No connections found in this category</p>
              <button 
                onClick={() => setShowNewConnectionForm(true)}
                className="mt-3 px-4 py-2 bg-accent text-black rounded-md"
              >
                Create One
              </button>
            </div>
          )}
        </div>
      </Card>
      
      {/* Your active connections */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Your Active Connections</h3>
            <p className="text-sm text-text-secondary mt-1">
              You haven't joined any connections yet
            </p>
          </div>
          <button className="flex items-center gap-1 text-accent hover:underline">
            View History <FaChevronRight size={12} />
          </button>
        </div>
      </Card>
      
      {/* Connection tips */}
      <Card>
        <h3 className="text-lg font-medium mb-3">Connection Tips</h3>
        <div className="space-y-3">
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-sm">
              <span className="text-accent font-medium">Be authentic</span> - These are anonymous but ephemeral, so be yourself!
            </p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-sm">
              <span className="text-accent font-medium">Be helpful</span> - Many connections are for academic help, share your knowledge!
            </p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-sm">
              <span className="text-accent font-medium">Be present</span> - Connections expire in 24 hours, so make the most of them!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EphemeralConnections;
