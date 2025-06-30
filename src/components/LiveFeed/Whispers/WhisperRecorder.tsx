import React, { useState, useEffect } from 'react';
import { useLiveFeed } from '../../../contexts/LiveFeedContext';
import Card from '../../Card';
import { FaMicrophone, FaStop, FaTrash } from 'react-icons/fa';

const WhisperRecorder: React.FC = () => {
  const { addWhisper } = useLiveFeed();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingContent, setRecordingContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'confession' | 'academic' | 'social' | 'campus-life'>('confession');
  
  // Truth Serum Challenge prompt
  const [challenge] = useState<string>(() => {
    const challenges = [
      "What's your secret study hack?",
      "What's something about campus life nobody warns you about?",
      "What's the craziest thing a professor has said in class?",
      "Share your biggest academic regret this semester"
    ];
    return challenges[Math.floor(Math.random() * challenges.length)];
  });

  // Timer for recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // In a real implementation, this would start recording audio
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // In a real implementation, this would stop recording and process the audio
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    setRecordingContent('');
  };

  const handlePost = async () => {
    if (!recordingContent.trim() && recordingTime === 0) return;
    
    await addWhisper({
      content: recordingContent,
      audioUrl: '/mock-audio/recording.mp3', // In a real implementation, this would be the actual audio URL
      duration: formatTime(recordingTime),
      category: selectedCategory,
      anonymousId: 'user-' + Math.random().toString(36).substring(2, 8), // Generate a random anonymous ID
      isAfterHours: new Date().getHours() >= 22 || new Date().getHours() < 6 // Consider after hours between 10PM and 6AM
    });
    
    // Reset form
    setRecordingContent('');
    setRecordingTime(0);
    setIsRecording(false);
  };

  return (
    <Card className="mb-6">
      {/* Truth Serum Challenge */}
      <div className="mb-4 bg-gray-800 p-3 rounded-lg">
        <h3 className="font-bold mb-1">TRUTH SERUM CHALLENGE:</h3>
        <p className="text-yellow-400">{challenge}</p>
      </div>
      
      {/* Recording interface */}
      <div className="mb-4">
        <textarea
          placeholder="Type your whisper here (optional)..."
          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mb-2"
          rows={2}
          value={recordingContent}
          onChange={(e) => setRecordingContent(e.target.value)}
        />
        
        <div className="flex flex-wrap gap-2 mb-2">
          {(['confession', 'academic', 'social', 'campus-life'] as const).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 py-1 rounded text-xs ${
                selectedCategory === category 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-gray-700 text-white'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center"
            >
              <FaMicrophone />
            </button>
          ) : (
            <>
              <button
                onClick={handleStopRecording}
                className="bg-gray-700 hover:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center"
              >
                <FaStop />
              </button>
              <button
                onClick={handleCancelRecording}
                className="bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
              >
                <FaTrash size={12} />
              </button>
            </>
          )}
          
          {isRecording && (
            <div className="text-red-500 font-medium">
              Recording: {formatTime(recordingTime)}
            </div>
          )}
        </div>
        
        <button
          onClick={handlePost}
          disabled={!recordingContent && recordingTime === 0}
          className={`px-4 py-1 rounded font-medium ${
            !recordingContent && recordingTime === 0
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-400 text-black hover:bg-yellow-500'
          }`}
        >
          Post Whisper
        </button>
      </div>
    </Card>
  );
};

export default WhisperRecorder;
