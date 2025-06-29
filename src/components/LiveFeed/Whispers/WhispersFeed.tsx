import React from 'react';
import { Whisper } from '../../../types/liveFeed';
import Card from '../../Card';
import { useLiveFeed } from '../../../contexts/LiveFeedContext';
import { FaPlay, FaPause, FaHeart, FaComment, FaShare } from 'react-icons/fa';

interface Props {
  whispers: Whisper[];
}

const WhispersFeed: React.FC<Props> = ({ whispers }) => {
  const { likeWhisper } = useLiveFeed();
  const [playingId, setPlayingId] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<number>(0);
  
  const timeAgo = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handlePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null); // Pause
    } else {
      setPlayingId(id); // Play
      // In a real implementation, this would start playing the audio
      // For now, we'll just simulate progress
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setPlayingId(null);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  const handleLike = (id: string) => {
    likeWhisper(id);
  };

  if (whispers.length === 0) {
    return <div className="text-center py-8 text-gray-400">No whispers yet. Be the first to share!</div>;
  }

  return (
    <div className="space-y-4">
      {whispers.map(whisper => (
        <Card key={whisper.id} className={whisper.isAfterHours ? 'border-purple-500' : ''}>
          <div className="mb-2 flex justify-between">
            <div className="font-medium">Anonymous #{whisper.anonymousId}</div>
            <div className="text-sm text-gray-400">{timeAgo(whisper.timestamp)}</div>
          </div>
          
          <p className="mb-3">{whisper.content}</p>
          
          {/* Audio player */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <button 
                onClick={() => handlePlay(whisper.id)}
                className="bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
              >
                {playingId === whisper.id ? <FaPause /> : <FaPlay />}
              </button>
              <div className="text-sm">{whisper.duration}</div>
            </div>
            
            <div className="bg-gray-700 rounded-full h-1.5 w-full">
              <div 
                className="bg-yellow-400 h-1.5 rounded-full" 
                style={{ width: playingId === whisper.id ? `${progress}%` : '0%' }}
              ></div>
            </div>
          </div>
          
          {/* Interaction buttons */}
          <div className="flex gap-4">
            <button 
              onClick={() => handleLike(whisper.id)}
              className="flex items-center gap-1 text-gray-400 hover:text-yellow-400"
            >
              <FaHeart /> <span>{whisper.likes}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-400 hover:text-yellow-400">
              <FaComment /> <span>{whisper.comments}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-400 hover:text-yellow-400">
              <FaShare />
            </button>
            
            {whisper.isAfterHours && (
              <div className="ml-auto text-xs text-purple-400 font-medium">AFTER HOURS</div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WhispersFeed;
