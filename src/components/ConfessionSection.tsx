"use client";

import React, { useState } from 'react';
import Card from './Card';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface Confession {
  id: number;
  text: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
}

interface ConfessionSectionProps {
  featuredConfession: Confession;
}

const ConfessionSection: React.FC<ConfessionSectionProps> = ({ featuredConfession }) => {
  const [confession, setConfession] = useState(featuredConfession);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newConfession, setNewConfession] = useState('');

  const handleUpvote = () => {
    setConfession(prev => ({
      ...prev,
      upvotes: prev.upvotes + 1
    }));
  };

  const handleDownvote = () => {
    setConfession(prev => ({
      ...prev,
      downvotes: prev.downvotes + 1
    }));
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmitConfession = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the confession to an API
    console.log('Confession submitted:', newConfession);
    setNewConfession('');
    toggleModal();
  };

  return (
    <div className="space-y-6">
      <h2 className="section-header">
        <span>🎭 CAMPUS UNCENSORED</span>
      </h2>
      
      <Card className="bg-gradient-to-br from-secondary-bg to-[#2a2a2a] border-2 border-accent">
        <div className="space-y-4">
          <p className="text-text-primary italic text-lg font-medium">"{confession.text}"</p>
          <p className="text-text-secondary text-sm">{confession.timestamp}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button 
                onClick={handleUpvote}
                className="flex items-center space-x-1 text-text-secondary hover:text-accent transition-colors"
              >
                <FaArrowUp />
                <span>{confession.upvotes}</span>
              </button>
              
              <button 
                onClick={handleDownvote}
                className="flex items-center space-x-1 text-text-secondary hover:text-accent transition-colors"
              >
                <FaArrowDown />
                <span>{confession.downvotes}</span>
              </button>
            </div>
            
            <button className="text-accent text-sm hover:underline">
              View More
            </button>
          </div>
        </div>
      </Card>
      
      <button 
        onClick={toggleModal}
        className="btn btn-secondary w-full"
      >
        Share Your Secret
      </button>
      
      {/* Confession Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-secondary-bg border border-accent rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-accent">Share Your Secret</h3>
              <button 
                onClick={toggleModal}
                className="text-text-secondary hover:text-accent"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitConfession}>
              <div className="mb-4">
                <label className="block text-text-secondary mb-2">
                  Type
                </label>
                <select className="w-full bg-primary-bg border border-accent-50 rounded-md p-2 text-text-primary">
                  <option value="secret">Secret</option>
                  <option value="spotted">Spotted</option>
                  <option value="tea">Campus Tea</option>
                  <option value="rant">Rant</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-text-secondary mb-2">
                  Content
                </label>
                <textarea 
                  className="w-full bg-primary-bg border border-accent-50 rounded-md p-2 text-text-primary h-32"
                  value={newConfession}
                  onChange={(e) => setNewConfession(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-text-secondary mb-2">
                  Tags (optional)
                </label>
                <input 
                  type="text" 
                  className="w-full bg-primary-bg border border-accent-50 rounded-md p-2 text-text-primary"
                  placeholder="Separate tags with commas"
                />
              </div>
              
              <button 
                type="submit"
                className="btn btn-primary w-full"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfessionSection;
