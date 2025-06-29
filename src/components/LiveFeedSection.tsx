"use client";
import React, { useState } from 'react';
import { useLiveFeed } from '../contexts/LiveFeedContext';
import Card from './Card';
import { FaFire, FaRegCalendarAlt, FaRegNewspaper, FaExclamationTriangle } from 'react-icons/fa';

// Common components
import FinalsCountdown from './LiveFeed/Common/FinalsCountdown';
import WeatherWidget from './LiveFeed/Common/WeatherWidget';
import TrendingTopics from './LiveFeed/Common/TrendingTopics';
import StudySpotTracker from './LiveFeed/Common/StudySpotTracker';

// Panic Button components
import PanicButton from './LiveFeed/PanicButton/PanicButton';
import PanicAlertsList from './LiveFeed/PanicButton/PanicAlertsList';

// Whispers components
import WhispersFeed from './LiveFeed/Whispers/WhispersFeed';
import WhisperRecorder from './LiveFeed/Whispers/WhisperRecorder';
import TruthSerumChallenge from './LiveFeed/Whispers/TruthSerumChallenge';

// Weekend Planner components
import EventCalendar from './LiveFeed/WeekendPlanner/EventCalendar';
import EventCreator from './LiveFeed/WeekendPlanner/EventCreator';

// News components
import CampusNewsFeed from './LiveFeed/News/CampusNewsFeed';
import ExternalNewsFeed from './LiveFeed/News/ExternalNewsFeed';

const LiveFeedSection = () => {
  const { 
    whispers, 
    panicAlerts, 
    activeTab, 
    setActiveTab 
  } = useLiveFeed();
  
  const [showEventCreator, setShowEventCreator] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState('');

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Live Feed</h2>
      
      {/* Finals Countdown - Always visible */}
      <div className="mb-6">
        <FinalsCountdown />
      </div>
      
      {/* Tab Navigation */}
      <div className="flex mb-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('whispers')}
          className={`px-4 py-2 ${
            activeTab === 'whispers' ? 'border-b-2 border-yellow-400 text-white' : 'text-gray-400'
          }`}
        >
          <FaFire className="inline mr-2" />
          Feed
        </button>
        <button
          onClick={() => setActiveTab('panic')}
          className={`px-4 py-2 ${
            activeTab === 'panic' ? 'border-b-2 border-red-500 text-white' : 'text-gray-400'
          }`}
        >
          <FaExclamationTriangle className="inline mr-2" />
          Panic Button
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 ${
            activeTab === 'events' ? 'border-b-2 border-yellow-400 text-white' : 'text-gray-400'
          }`}
        >
          <FaRegCalendarAlt className="inline mr-2" />
          Weekend
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 ${
            activeTab === 'news' ? 'border-b-2 border-yellow-400 text-white' : 'text-gray-400'
          }`}
        >
          <FaRegNewspaper className="inline mr-2" />
          News
        </button>
      </div>
      
      {/* Content based on active tab */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main content area */}
        <div className="md:col-span-2">
          {activeTab === 'whispers' && (
            <>
              <WhisperRecorder />
              <WhispersFeed whispers={whispers} />
            </>
          )}
          
          {activeTab === 'panic' && (
            <>
              <PanicButton />
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">Active Panic Alerts</h3>
                <PanicAlertsList alerts={panicAlerts} />
              </div>
            </>
          )}
          
          {activeTab === 'events' && (
            <>
              <EventCalendar />
              {showEventCreator && (
                <EventCreator onClose={() => setShowEventCreator(false)} />
              )}
            </>
          )}
          
          {activeTab === 'news' && (
            <>
              <CampusNewsFeed />
              <div className="mt-8">
                <ExternalNewsFeed />
              </div>
            </>
          )}
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Weather widget - always visible */}
          <Card className="mb-4">
            <WeatherWidget />
          </Card>
          
          {/* Truth Serum Challenge - visible on feed tab */}
          {activeTab === 'whispers' && (
            <TruthSerumChallenge onSelectChallenge={setCurrentChallenge} />
          )}
          
          {/* Trending Topics - always visible */}
          <Card className="mb-4">
            <TrendingTopics />
          </Card>
          
          {/* Study Spot Tracker - visible on feed and panic tabs */}
          {(activeTab === 'whispers' || activeTab === 'panic') && (
            <Card className="mb-4">
              <StudySpotTracker />
            </Card>
          )}
          
          {/* Active Panic Alerts - visible on feed tab */}
          {activeTab === 'whispers' && panicAlerts.length > 0 && (
            <Card className="mb-4 border-red-500 border">
              <h3 className="font-bold text-lg mb-2">Active Panic Alerts</h3>
              <PanicAlertsList alerts={panicAlerts.slice(0, 2)} />
              {panicAlerts.length > 2 && (
                <button 
                  onClick={() => setActiveTab('panic')}
                  className="text-red-500 text-sm font-medium mt-2"
                >
                  View all {panicAlerts.length} active alerts
                </button>
              )}
            </Card>
          )}
        </div>
      </div>
      
      {/* No Anonymous Identity Card in this version */}
      
      {/* Event Creator Button - visible on events tab */}
      {activeTab === 'events' && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setShowEventCreator(true)}
            className="bg-yellow-400 text-black rounded-full p-4 shadow-lg hover:bg-yellow-500"
          >
            <FaRegCalendarAlt size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveFeedSection;
