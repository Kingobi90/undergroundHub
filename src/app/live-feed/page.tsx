"use client";

import React from 'react';
import LinkedInStyleFeed from '../../components/LinkedInStyleFeed';

export default function LiveFeedPage() {
  return (
    <main className="min-h-screen bg-primary-bg pt-20">
      {/* Navigation Bar - Fixed at the top */}
      <div className="bg-secondary-bg fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-6">
              <a href="/" className="text-xl font-bold text-white">UG Campus Hub</a>
              <nav className="hidden md:flex space-x-4">
                <a href="/live-feed" className="text-yellow-400 font-medium">Live Feed</a>
                <a href="/unified-feed" className="text-gray-300 hover:text-white">Unified Feed</a>
                <a href="/sos" className="text-gray-300 hover:text-white">SOS</a>
              </nav>
            </div>
            
            {/* User Actions */}
            <div className="flex space-x-3">
              <a href="/live-feed">
                <button className="bg-transparent hover:bg-gray-800 px-4 py-1 rounded-full text-sm font-medium border border-gray-700">
                  Log in
                </button>
              </a>
              <button className="bg-white hover:bg-gray-200 text-black px-4 py-1 rounded-full text-sm font-medium">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <LinkedInStyleFeed />
    </main>
  );
}
