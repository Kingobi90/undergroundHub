import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

interface Props {
  audioUrl: string;
  duration: string;
  onPlay?: () => void;
  onPause?: () => void;
}

const AudioPlayer: React.FC<Props> = ({ audioUrl, duration, onPlay, onPause }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(audioUrl);
    
    // Set up event listeners
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (onPause) onPause();
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    // Cleanup
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [audioUrl, onPause]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      if (onPause) onPause();
    } else {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        // For demo purposes, simulate playback if audio fails to load
        simulatePlayback();
      });
      if (onPlay) onPlay();
    }
    
    setIsPlaying(!isPlaying);
  };

  // Simulate playback for demo purposes
  const simulatePlayback = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsPlaying(false);
          if (onPause) onPause();
          return 0;
        }
        return prev + 0.5;
      });
    }, 50);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    
    // Set new position
    const newTime = clickPosition * audio.duration;
    audio.currentTime = newTime;
    setProgress(clickPosition * 100);
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={togglePlayPause}
        className="bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      
      <div className="flex-1">
        <div 
          className="bg-gray-700 rounded-full h-1.5 w-full cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="bg-yellow-400 h-1.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-sm text-gray-400">{duration}</div>
    </div>
  );
};

export default AudioPlayer;
