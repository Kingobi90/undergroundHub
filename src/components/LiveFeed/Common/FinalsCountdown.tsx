import React from 'react';
import { useLiveFeed } from '../../../contexts/LiveFeedContext';
import Card from '../../Card';

const FinalsCountdown: React.FC = () => {
  const { daysUntilFinals, finalsDate } = useLiveFeed();
  
  // Get context-aware message based on days remaining
  const getContextMessage = () => {
    if (!daysUntilFinals) return 'Finals date not set';
    
    if (daysUntilFinals <= 0) return 'FINALS: NOW - Good luck!';
    if (daysUntilFinals <= 7) return `FINALS: ${daysUntilFinals} DAYS - It's crunch time!`;
    if (daysUntilFinals <= 30) return `FINALS: ${daysUntilFinals} DAYS - Time to focus`;
    if (daysUntilFinals <= 60) return `Finals: ${daysUntilFinals} days - Start planning`;
    return `Finals: ${daysUntilFinals} days - You've got time`;
  };

  // Calculate progress through semester (assuming 120 days per semester)
  const semesterProgress = () => {
    if (!daysUntilFinals) return 0;
    const totalDays = 120;
    const daysPassed = totalDays - daysUntilFinals;
    return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
  };

  // Get color based on time remaining
  const getProgressColor = () => {
    if (!daysUntilFinals) return 'bg-gray-600';
    if (daysUntilFinals <= 7) return 'bg-red-500';
    if (daysUntilFinals <= 30) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  return (
    <Card className="mb-6 cursor-pointer hover:bg-gray-800 transition-colors">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{getContextMessage()}</h2>
          <button className="text-sm text-gray-400 hover:text-white">[EXPAND]</button>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
          <div 
            className={`h-2.5 rounded-full ${getProgressColor()}`} 
            style={{ width: `${semesterProgress()}%` }}
          ></div>
        </div>
        
        {/* Additional info */}
        <div className="text-sm text-gray-400">
          {finalsDate && (
            <p>Finals begin on {finalsDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FinalsCountdown;
