"use client";

import React, { useState } from 'react';
import Card from './Card';

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

interface Poll {
  id: number;
  question: string;
  options: PollOption[];
  totalVotes: number;
}

interface PollSectionProps {
  polls: Poll[];
}

const PollSection: React.FC<PollSectionProps> = ({ polls: initialPolls }) => {
  const [polls, setPolls] = useState(initialPolls);
  const [activePollIndex, setActivePollIndex] = useState(0);
  const poll = polls[activePollIndex];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleOptionSelect = (optionId: number) => {
    if (!hasVoted) {
      setSelectedOption(optionId);
    }
  };

  const handleVote = () => {
    if (selectedOption !== null && !hasVoted) {
      setPolls(prevPolls => {
        return prevPolls.map((p, index) => {
          if (index === activePollIndex) {
            const updatedOptions = p.options.map(option => {
              if (option.id === selectedOption) {
                return { ...option, votes: option.votes + 1 };
              }
              return option;
            });
            
            return {
              ...p,
              options: updatedOptions,
              totalVotes: p.totalVotes + 1
            };
          }
          return p;
        });
      });
      
      setHasVoted(true);
    }
  };

  const calculatePercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="section-header mb-0">
          <span>🗳️ CAMPUS POLLS</span>
        </h2>
        
        {polls.length > 1 && (
          <div className="flex gap-1">
            {polls.map((_, index) => (
              <button 
                key={index} 
                onClick={() => {
                  setActivePollIndex(index);
                  setSelectedOption(null);
                  setHasVoted(false);
                }}
                className={`w-2 h-2 rounded-full ${index === activePollIndex ? 'bg-accent' : 'bg-gray-600'}`}
                aria-label={`Poll ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      <Card>
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-text-primary">{poll.question}</h3>
          
          <div className="space-y-4">
            {poll.options.map(option => (
              <div 
                key={option.id} 
                className={`cursor-pointer ${hasVoted ? 'pointer-events-none' : ''}`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className="flex justify-between mb-1">
                  <span className={`text-sm ${selectedOption === option.id ? 'text-accent' : 'text-text-primary'}`}>
                    {option.text}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {calculatePercentage(option.votes)}%
                  </span>
                </div>
                
                <div className="w-full h-2 bg-primary-bg rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-500 ease-out"
                    style={{ width: `${calculatePercentage(option.votes)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">
              {poll.totalVotes} votes
            </span>
            
            <button 
              onClick={handleVote}
              disabled={selectedOption === null || hasVoted}
              className={`btn btn-primary ${(selectedOption === null || hasVoted) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {hasVoted ? 'Voted' : 'Vote'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PollSection;
