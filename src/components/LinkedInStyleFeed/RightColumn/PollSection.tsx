"use client";

import React, { useState } from 'react';
import Card from '../../Card';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  expiresAt: Date | string;
  userVoted?: boolean;
}

interface PollSectionProps {
  polls?: Poll[];
}

const PollSection: React.FC<PollSectionProps> = ({
  polls = [
    {
      id: '1',
      question: 'Which study space on campus needs improvement?',
      options: [
        { id: '1a', text: 'Library', votes: 45 },
        { id: '1b', text: 'Student Center', votes: 32 },
        { id: '1c', text: 'Department Lounges', votes: 28 },
        { id: '1d', text: 'Outdoor Areas', votes: 19 }
      ],
      totalVotes: 124,
      expiresAt: new Date(Date.now() + 86400000 * 2), // 2 days from now
      userVoted: false
    },
    {
      id: '2',
      question: 'What food option would you like to see added to campus?',
      options: [
        { id: '2a', text: 'Sushi Bar', votes: 67 },
        { id: '2b', text: 'Vegan Café', votes: 42 },
        { id: '2c', text: 'Taco Stand', votes: 58 },
        { id: '2d', text: 'Bubble Tea Shop', votes: 89 }
      ],
      totalVotes: 256,
      expiresAt: new Date(Date.now() + 86400000 * 1), // 1 day from now
      userVoted: false
    }
  ]
}) => {
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  
  const handleVote = (pollId: string, optionId: string) => {
    setUserVotes(prev => ({
      ...prev,
      [pollId]: optionId
    }));
  };
  
  // Format expiration date
  const formatExpiration = (date: Date | string) => {
    if (!date) return '';
    
    const expirationDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = expirationDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Closing soon';
    if (diffHours < 24) return `Closes in ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Closes in ${diffDays}d`;
  };
  
  // Calculate percentage for a given option
  const calculatePercentage = (votes: number, totalVotes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <Card className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-white">Active Polls</h3>
        <button className="text-accent text-sm">See all</button>
      </div>
      
      <div className="space-y-6">
        {polls.map((poll) => (
          <div key={poll.id} className="border-b border-accent-30 last:border-0 pb-4 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-white">{poll.question}</h4>
              <span className="text-xs text-text-secondary">{formatExpiration(poll.expiresAt)}</span>
            </div>
            
            <div className="space-y-2 mt-3">
              {poll.options.map((option) => {
                const percentage = calculatePercentage(option.votes, poll.totalVotes);
                const hasVoted = userVotes[poll.id] === option.id;
                
                return (
                  <div key={option.id} className="relative">
                    <button
                      onClick={() => handleVote(poll.id, option.id)}
                      disabled={userVotes[poll.id] !== undefined}
                      className={`w-full text-left p-2 rounded-md ${
                        hasVoted ? 'bg-accent-30 text-white' : 
                        userVotes[poll.id] ? 'bg-primary-bg text-text-secondary' : 
                        'bg-primary-bg hover:bg-accent-30 text-text-secondary hover:text-white'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span>{option.text}</span>
                        {userVotes[poll.id] !== undefined && (
                          <span>{percentage}%</span>
                        )}
                      </div>
                    </button>
                    
                    {/* Progress bar (only shown after voting) */}
                    {userVotes[poll.id] !== undefined && (
                      <div className="w-full h-1 bg-primary-bg mt-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${hasVoted ? 'bg-accent' : 'bg-gray-600'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Vote count */}
            <div className="mt-2 text-xs text-text-secondary">
              {userVotes[poll.id] !== undefined ? (
                <p>{poll.totalVotes} votes • You voted</p>
              ) : (
                <p>{poll.totalVotes} votes • Vote to see results</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PollSection;
