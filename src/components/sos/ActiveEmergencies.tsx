import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserFriends, FaChalkboardTeacher, FaBook, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Card from '../Card';

interface EmergencySession {
  id: string;
  type: 'study-group' | 'tutoring' | 'material-sharing';
  title: string;
  courseCode: string;
  participants: number;
  maxParticipants: number;
  startTime: Date;
  location: string;
  host: string;
}

interface ActiveEmergenciesProps {
  userId: string;
}

const ActiveEmergencies: React.FC<ActiveEmergenciesProps> = ({ userId }) => {
  // Mock data - in a real app this would come from an API
  const [sessions, setSessions] = useState<EmergencySession[]>([
    {
      id: 'session-1',
      type: 'study-group',
      title: 'CS101 Final Exam Prep',
      courseCode: 'CS101',
      participants: 4,
      maxParticipants: 8,
      startTime: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      location: 'Library, Floor 2, Study Room C',
      host: 'Alex K.'
    },
    {
      id: 'session-2',
      type: 'tutoring',
      title: 'Calculus II Problem Solving',
      courseCode: 'MATH201',
      participants: 2,
      maxParticipants: 5,
      startTime: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      location: 'Math Building, Room 302',
      host: 'Professor Zhang'
    },
    {
      id: 'session-3',
      type: 'material-sharing',
      title: 'Physics Exam Formula Review',
      courseCode: 'PHYS202',
      participants: 6,
      maxParticipants: 10,
      startTime: new Date(Date.now() - 45 * 60000), // 45 minutes ago
      location: 'Science Center, Common Area',
      host: 'Study Group B'
    },
    {
      id: 'session-4',
      type: 'study-group',
      title: 'Biology Lab Preparation',
      courseCode: 'BIO101',
      participants: 3,
      maxParticipants: 6,
      startTime: new Date(Date.now() - 10 * 60000), // 10 minutes ago
      location: 'Life Sciences Building, Room 201',
      host: 'Jamie T.'
    },
    {
      id: 'session-5',
      type: 'tutoring',
      title: 'Economics Concepts Review',
      courseCode: 'ECON202',
      participants: 4,
      maxParticipants: 8,
      startTime: new Date(Date.now() - 20 * 60000), // 20 minutes ago
      location: 'Business School, Study Hub',
      host: 'TA Johnson'
    }
  ]);

  // State for scroll position
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showJoinConfirm, setShowJoinConfirm] = useState<string | null>(null);

  // Handle scroll
  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('emergencies-container');
    if (!container) return;
    
    const scrollAmount = 300; // Adjust as needed
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };

  // Handle join session
  const handleJoinSession = (sessionId: string) => {
    setShowJoinConfirm(sessionId);
  };

  // Confirm join session
  const confirmJoinSession = (sessionId: string) => {
    // In a real app, this would connect to the session
    console.log(`Joining session ${sessionId}`);
    
    // Update participant count
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, participants: session.participants + 1 }
          : session
      )
    );
    
    setShowJoinConfirm(null);
  };

  // Get icon based on session type
  const getSessionIcon = (type: EmergencySession['type']) => {
    switch (type) {
      case 'study-group':
        return <FaUserFriends size={20} />;
      case 'tutoring':
        return <FaChalkboardTeacher size={20} />;
      case 'material-sharing':
        return <FaBook size={20} />;
      default:
        return <FaUserFriends size={20} />;
    }
  };

  // Get color based on session type
  const getSessionColor = (type: EmergencySession['type']) => {
    switch (type) {
      case 'study-group':
        return 'border-blue-500';
      case 'tutoring':
        return 'border-purple-500';
      case 'material-sharing':
        return 'border-green-500';
      default:
        return 'border-accent';
    }
  };

  // Format time elapsed
  const formatTimeElapsed = (startTime: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m ago`;
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Active Study Emergencies</h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleScroll('left')}
            className="p-2 rounded-full bg-primary-bg text-text-secondary hover:text-accent"
            aria-label="Scroll left"
          >
            <FaArrowLeft />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleScroll('right')}
            className="p-2 rounded-full bg-primary-bg text-text-secondary hover:text-accent"
            aria-label="Scroll right"
          >
            <FaArrowRight />
          </motion.button>
        </div>
      </div>

      <div 
        id="emergencies-container"
        className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {sessions.map(session => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex-shrink-0 w-64 bg-primary-bg rounded-lg p-4 border-l-4 ${getSessionColor(session.type)}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-accent">{getSessionIcon(session.type)}</span>
                <h4 className="font-semibold">{session.courseCode}</h4>
              </div>
              <span className="text-xs text-text-secondary">
                {formatTimeElapsed(session.startTime)}
              </span>
            </div>
            
            <h5 className="font-medium mb-2">{session.title}</h5>
            
            <div className="text-sm text-text-secondary mb-3">
              <p>Host: {session.host}</p>
              <p>Location: {session.location}</p>
              <div className="flex items-center gap-1 mt-1">
                <FaUserFriends size={14} />
                <span>{session.participants}/{session.maxParticipants} participants</span>
              </div>
            </div>
            
            {showJoinConfirm === session.id ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowJoinConfirm(null)}
                  className="flex-1 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmJoinSession(session.id)}
                  className="flex-1 py-1 text-sm bg-accent text-primary-bg hover:bg-opacity-90 rounded"
                >
                  Confirm
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleJoinSession(session.id)}
                className="w-full py-1 text-sm bg-secondary-bg hover:bg-opacity-90 rounded"
                disabled={session.participants >= session.maxParticipants}
              >
                {session.participants >= session.maxParticipants ? 'Full' : 'Join Session'}
              </motion.button>
            )}
          </motion.div>
        ))}
        
        {/* Create New Session Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 w-64 bg-primary-bg rounded-lg p-4 border border-dashed border-gray-600 flex flex-col items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-secondary-bg flex items-center justify-center mb-2">
            <span className="text-2xl font-light text-accent">+</span>
          </div>
          <p className="text-center text-text-secondary">Create New Emergency Session</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-3 px-4 py-1 text-sm bg-accent text-primary-bg hover:bg-opacity-90 rounded"
          >
            Start
          </motion.button>
        </motion.div>
      </div>
      
      {/* Custom CSS for hiding scrollbar but allowing scroll */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </Card>
  );
};

export default ActiveEmergencies;
