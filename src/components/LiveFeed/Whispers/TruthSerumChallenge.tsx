import React, { useState, useEffect } from 'react';
import Card from '../../Card';

interface Props {
  onSelectChallenge: (challenge: string) => void;
}

const TruthSerumChallenge: React.FC<Props> = ({ onSelectChallenge }) => {
  const [challenges] = useState<string[]>([
    "What's your secret study hack?",
    "What's something about campus life nobody warns you about?",
    "What's the craziest thing a professor has said in class?",
    "Share your biggest academic regret this semester",
    "Tell us about a campus rule you've broken",
    "What's the wildest thing you've seen at a party?",
    "What's a campus secret spot most people don't know about?",
    "What's the most embarrassing thing that happened to you this semester?",
    "What's something you wish you could tell your professor?"
  ]);
  
  const [currentChallenge, setCurrentChallenge] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(24); // Hours
  
  useEffect(() => {
    // Select a random challenge on mount
    const randomIndex = Math.floor(Math.random() * challenges.length);
    setCurrentChallenge(challenges[randomIndex]);
    onSelectChallenge(challenges[randomIndex]);
    
    // In a real implementation, this would be based on server time
    // For now, just simulate a countdown
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Select a new challenge when time expires
          const newIndex = Math.floor(Math.random() * challenges.length);
          setCurrentChallenge(challenges[newIndex]);
          onSelectChallenge(challenges[newIndex]);
          return 24;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [challenges, onSelectChallenge]);

  return (
    <Card className="mb-4 bg-gray-800 border-yellow-400 border">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg mb-1">TRUTH SERUM CHALLENGE</h3>
          <p className="text-yellow-400 text-lg">{currentChallenge}</p>
        </div>
        <div className="text-sm text-gray-400">
          New challenge in {timeRemaining}h
        </div>
      </div>
      
      <div className="mt-3 text-sm text-gray-400">
        Answer this challenge with your whisper to earn extra campus cred
      </div>
    </Card>
  );
};

export default TruthSerumChallenge;
