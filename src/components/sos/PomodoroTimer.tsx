import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaRedo, FaCog, FaForward } from 'react-icons/fa';
import { useSOSContext } from '../../contexts/SOSContext';
import Card from '../Card';

interface PomodoroTimerProps {
  defaultFocusTime?: number;  // in minutes
  defaultShortBreak?: number;  // in minutes
  defaultLongBreak?: number;  // in minutes
  sessionsBeforeLongBreak?: number;
  onSessionComplete?: (sessionData: {
    type: 'focus' | 'shortBreak' | 'longBreak';
    duration: number;
    completedAt: Date;
    associatedCourse?: string;
  }) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  defaultFocusTime = 25,
  defaultShortBreak = 5,
  defaultLongBreak = 15,
  sessionsBeforeLongBreak = 4,
  onSessionComplete
}) => {
  const { pomodoroSettings, updatePomodoroSettings, addSessionData } = useSOSContext();
  
  // Timer state
  const [timerType, setTimerType] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings form state
  const [formSettings, setFormSettings] = useState({
    focusTime: pomodoroSettings.focusTime,
    shortBreakTime: pomodoroSettings.shortBreakTime,
    longBreakTime: pomodoroSettings.longBreakTime,
    sessionsBeforeLongBreak: pomodoroSettings.sessionsBeforeLongBreak
  });
  
  // Audio refs for notifications
  const focusEndSound = useRef<HTMLAudioElement | null>(null);
  const breakEndSound = useRef<HTMLAudioElement | null>(null);
  
  // Set up audio elements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      focusEndSound.current = new Audio('/sounds/focus-end.mp3');
      breakEndSound.current = new Audio('/sounds/break-end.mp3');
    }
  }, []);
  
  // Calculate total time based on timer type
  const getTotalTime = () => {
    switch (timerType) {
      case 'focus':
        return pomodoroSettings.focusTime * 60;
      case 'shortBreak':
        return pomodoroSettings.shortBreakTime * 60;
      case 'longBreak':
        return pomodoroSettings.longBreakTime * 60;
      default:
        return pomodoroSettings.focusTime * 60;
    }
  };
  
  // Calculate progress percentage
  const progress = (1 - timeLeft / getTotalTime()) * 100;
  
  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      const sessionData = {
        type: timerType,
        duration: getTotalTime(),
        completedAt: new Date()
      };
      
      // Play sound based on timer type
      if (timerType === 'focus') {
        focusEndSound.current?.play();
        
        // Increment sessions and determine next break type
        const newSessionsCompleted = sessionsCompleted + 1;
        setSessionsCompleted(newSessionsCompleted);
        
        if (newSessionsCompleted % pomodoroSettings.sessionsBeforeLongBreak === 0) {
          setTimerType('longBreak');
          setTimeLeft(pomodoroSettings.longBreakTime * 60);
        } else {
          setTimerType('shortBreak');
          setTimeLeft(pomodoroSettings.shortBreakTime * 60);
        }
      } else {
        // Break ended
        breakEndSound.current?.play();
        setTimerType('focus');
        setTimeLeft(pomodoroSettings.focusTime * 60);
      }
      
      // Call session complete callbacks
      if (onSessionComplete) onSessionComplete(sessionData);
      addSessionData(sessionData);
      
      // Notify user
      if (Notification.permission === 'granted') {
        new Notification(`${timerType === 'focus' ? 'Focus session' : 'Break'} completed!`, {
          body: timerType === 'focus' 
            ? 'Time for a break!' 
            : 'Time to get back to work!',
          icon: '/icons/timer-icon.png'
        });
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, timerType, pomodoroSettings, sessionsCompleted, onSessionComplete, addSessionData]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle timer controls
  const toggleTimer = () => setIsActive(prev => !prev);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getTotalTime());
  };
  
  const skipToNextPhase = () => {
    setIsActive(false);
    
    if (timerType === 'focus') {
      // Skip to break
      if ((sessionsCompleted + 1) % pomodoroSettings.sessionsBeforeLongBreak === 0) {
        setTimerType('longBreak');
        setTimeLeft(pomodoroSettings.longBreakTime * 60);
      } else {
        setTimerType('shortBreak');
        setTimeLeft(pomodoroSettings.shortBreakTime * 60);
      }
      setSessionsCompleted(prev => prev + 1);
    } else {
      // Skip to focus
      setTimerType('focus');
      setTimeLeft(pomodoroSettings.focusTime * 60);
    }
  };
  
  // Handle settings form
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormSettings(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };
  
  const saveSettings = () => {
    updatePomodoroSettings(formSettings);
    setTimeLeft(
      timerType === 'focus'
        ? formSettings.focusTime * 60
        : timerType === 'shortBreak'
        ? formSettings.shortBreakTime * 60
        : formSettings.longBreakTime * 60
    );
    setShowSettings(false);
  };
  
  // Get color based on timer type
  const getTimerColor = () => {
    switch (timerType) {
      case 'focus':
        return 'text-accent border-accent';
      case 'shortBreak':
        return 'text-green-400 border-green-400';
      case 'longBreak':
        return 'text-blue-400 border-blue-400';
      default:
        return 'text-accent border-accent';
    }
  };
  
  return (
    <Card className="relative">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4">
          {timerType === 'focus' ? 'Focus Time' : timerType === 'shortBreak' ? 'Short Break' : 'Long Break'}
        </h3>
        
        {/* Timer Display */}
        <div className="relative w-48 h-48 mb-4">
          {/* Circular Progress */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#333"
              strokeWidth="8"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={timerType === 'focus' ? '#FEDA3C' : timerType === 'shortBreak' ? '#4ADE80' : '#60A5FA'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="282.74"
              strokeDashoffset={282.74 * (1 - progress / 100)}
              initial={{ strokeDashoffset: 282.74 }}
              animate={{ strokeDashoffset: 282.74 * (1 - progress / 100) }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </svg>
          
          {/* Timer Text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <motion.div
              key={timerType}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`text-2xl font-bold ${getTimerColor()}`}
            >
              {formatTime(timeLeft)}
            </motion.div>
            <p className="text-text-secondary text-sm mt-1">
              Session {sessionsCompleted + 1}
            </p>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex space-x-4 mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className="btn-secondary rounded-full p-3"
            aria-label={isActive ? "Pause timer" : "Start timer"}
          >
            {isActive ? <FaPause /> : <FaPlay />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTimer}
            className="btn-secondary rounded-full p-3"
            aria-label="Reset timer"
          >
            <FaRedo />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={skipToNextPhase}
            className="btn-secondary rounded-full p-3"
            aria-label="Skip to next phase"
          >
            <FaForward />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
            className="btn-secondary rounded-full p-3"
            aria-label="Timer settings"
          >
            <FaCog />
          </motion.button>
        </div>
        
        {/* Phase Indicators */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: pomodoroSettings.sessionsBeforeLongBreak }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < sessionsCompleted % pomodoroSettings.sessionsBeforeLongBreak
                  ? 'bg-accent'
                  : i === sessionsCompleted % pomodoroSettings.sessionsBeforeLongBreak && timerType === 'focus'
                  ? 'bg-accent animate-pulse'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-secondary-bg p-6 rounded-lg w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Timer Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="focusTime" className="block text-sm font-medium text-text-secondary mb-1">
                  Focus Time (minutes)
                </label>
                <input
                  type="number"
                  id="focusTime"
                  name="focusTime"
                  min="1"
                  max="60"
                  value={formSettings.focusTime}
                  onChange={handleSettingsChange}
                  className="w-full bg-primary-bg border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              
              <div>
                <label htmlFor="shortBreakTime" className="block text-sm font-medium text-text-secondary mb-1">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  id="shortBreakTime"
                  name="shortBreakTime"
                  min="1"
                  max="30"
                  value={formSettings.shortBreakTime}
                  onChange={handleSettingsChange}
                  className="w-full bg-primary-bg border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              
              <div>
                <label htmlFor="longBreakTime" className="block text-sm font-medium text-text-secondary mb-1">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  id="longBreakTime"
                  name="longBreakTime"
                  min="1"
                  max="60"
                  value={formSettings.longBreakTime}
                  onChange={handleSettingsChange}
                  className="w-full bg-primary-bg border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              
              <div>
                <label htmlFor="sessionsBeforeLongBreak" className="block text-sm font-medium text-text-secondary mb-1">
                  Sessions Before Long Break
                </label>
                <input
                  type="number"
                  id="sessionsBeforeLongBreak"
                  name="sessionsBeforeLongBreak"
                  min="1"
                  max="10"
                  value={formSettings.sessionsBeforeLongBreak}
                  onChange={handleSettingsChange}
                  className="w-full bg-primary-bg border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                className="btn-primary"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Card>
  );
};

export default PomodoroTimer;
