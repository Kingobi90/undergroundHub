"use client";

import React, { useState, useEffect } from 'react';
import { FaSmile, FaMeh, FaFrown, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

interface MoraleBarProps {
  initialMorale?: number; // 0-100 scale
  totalVotes?: number;
}

const MoraleBar: React.FC<MoraleBarProps> = ({ 
  initialMorale = 75,
  totalVotes = 243
}) => {
  const [morale, setMorale] = useState(initialMorale);
  const [userVoted, setUserVoted] = useState(false);
  const [votes, setVotes] = useState(totalVotes);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Handle scroll event to hide/show the morale bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  // Get morale color based on value
  const getMoraleColor = () => {
    if (morale >= 70) return 'bg-green-500';
    if (morale >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get morale icon based on value
  const getMoraleIcon = () => {
    if (morale >= 70) return <FaSmile className="text-green-500 text-xl" />;
    if (morale >= 40) return <FaMeh className="text-yellow-500 text-xl" />;
    return <FaFrown className="text-red-500 text-xl" />;
  };
  
  // Get morale text based on value
  const getMoraleText = () => {
    if (morale >= 85) return "Ecstatic";
    if (morale >= 70) return "Happy";
    if (morale >= 55) return "Good";
    if (morale >= 40) return "Meh";
    if (morale >= 25) return "Low";
    return "Depressed";
  };

  const handleVote = (isPositive: boolean) => {
    if (userVoted) return;
    
    // Calculate new morale based on vote
    const moraleChange = isPositive ? 1 : -1;
    const newMorale = Math.max(0, Math.min(100, morale + moraleChange));
    
    setMorale(newMorale);
    setUserVoted(true);
    setVotes(votes + 1);
  };

  return (
    <div className={`bg-secondary-bg border border-accent w-full py-2 px-4 fixed top-[56px] left-0 right-0 z-40 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {getMoraleIcon()}
            <span className="text-sm font-medium text-accent">Campus Morale</span>
          </div>
          
          <div className="flex-1 relative">
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div 
                className={`${getMoraleColor()} h-4 rounded-full transition-all duration-500 ease-in-out flex items-center justify-center`}
                style={{ width: `${morale}%` }}
              >
                <span className="text-xs font-bold text-black drop-shadow-sm">{getMoraleText()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 min-w-[180px]">
            <span className="text-xs text-text-secondary mr-1">How's it going?</span>
            <button 
              onClick={() => handleVote(false)} 
              disabled={userVoted}
              className={`p-1 rounded-full ${userVoted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-900 hover:bg-opacity-30'}`}
            >
              <FaThumbsDown className="text-red-500" />
            </button>
            <button 
              onClick={() => handleVote(true)} 
              disabled={userVoted}
              className={`p-1 rounded-full ${userVoted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-900 hover:bg-opacity-30'}`}
            >
              <FaThumbsUp className="text-green-500" />
            </button>
            <span className="text-xs text-text-secondary ml-1">{votes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoraleBar;
