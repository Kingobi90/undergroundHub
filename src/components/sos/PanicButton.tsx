import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationCircle, FaUserFriends, FaBook, FaChalkboardTeacher, FaTimes } from 'react-icons/fa';
import Card from '../Card';

interface PanicButtonProps {
  userId: string;
}

type HelpType = 'study-partner' | 'study-materials' | 'tutor';

const PanicButton: React.FC<PanicButtonProps> = ({ userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHelpType, setSelectedHelpType] = useState<HelpType | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Pulse animation for the button
  const pulseAnimation = {
    initial: {
      scale: 1,
      boxShadow: '0 0 0 rgba(255, 58, 58, 0)'
    },
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 0 0 rgba(255, 58, 58, 0)',
        '0 0 20px rgba(255, 58, 58, 0.7)',
        '0 0 0 rgba(255, 58, 58, 0)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop' as const
      }
    },
    hover: {
      scale: 1.1,
      boxShadow: '0 0 25px rgba(255, 58, 58, 0.8)',
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.95,
      boxShadow: '0 0 15px rgba(255, 58, 58, 0.5)',
      transition: {
        duration: 0.1
      }
    }
  };

  // Handle panic button click
  const handlePanicClick = () => {
    setIsModalOpen(true);
  };

  // Handle help type selection
  const handleHelpTypeSelect = (type: HelpType) => {
    setSelectedHelpType(type);
    setIsSearching(true);
    
    // Simulate searching for help (would connect to backend in real implementation)
    setTimeout(() => {
      setIsSearching(false);
    }, 3000);
  };

  // Handle modal close
  const handleCloseModal = () => {
    if (!isSearching) {
      setIsModalOpen(false);
      setSelectedHelpType(null);
    }
  };

  return (
    <Card className="flex flex-col items-center justify-center py-6">
      <h3 className="text-lg font-semibold mb-4">Need Immediate Help?</h3>
      
      <motion.button
        className="w-32 h-32 rounded-full bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg"
        variants={pulseAnimation}
        initial="initial"
        animate="pulse"
        whileHover="hover"
        whileTap="tap"
        onClick={handlePanicClick}
        aria-label="Emergency study help button"
      >
        <div className="flex flex-col items-center">
          <FaExclamationCircle size={32} />
          <span className="mt-2">PANIC</span>
        </div>
      </motion.button>
      
      <p className="text-sm text-text-secondary mt-4 text-center">
        Hit the button when you need immediate study assistance
      </p>
      
      {/* Help Type Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-secondary-bg rounded-lg p-6 w-full max-w-md relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              {!isSearching && (
                <button
                  className="absolute top-4 right-4 text-text-secondary hover:text-white"
                  onClick={handleCloseModal}
                  aria-label="Close modal"
                >
                  <FaTimes size={20} />
                </button>
              )}
              
              <h3 className="text-xl font-bold text-accent mb-6 text-center">
                {selectedHelpType ? 'Connecting you with help' : 'What kind of help do you need?'}
              </h3>
              
              {!selectedHelpType ? (
                <div className="grid grid-cols-1 gap-4">
                  <HelpTypeButton
                    icon={<FaUserFriends size={24} />}
                    title="Find Study Partner"
                    description="Connect with other students studying the same material"
                    onClick={() => handleHelpTypeSelect('study-partner')}
                  />
                  
                  <HelpTypeButton
                    icon={<FaBook size={24} />}
                    title="Emergency Study Materials"
                    description="Quick access to notes, summaries, and practice questions"
                    onClick={() => handleHelpTypeSelect('study-materials')}
                  />
                  
                  <HelpTypeButton
                    icon={<FaChalkboardTeacher size={24} />}
                    title="Find Available Tutor"
                    description="Connect with tutors available right now for help"
                    onClick={() => handleHelpTypeSelect('tutor')}
                  />
                </div>
              ) : (
                <div className="text-center">
                  {isSearching ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-text-primary">
                        {selectedHelpType === 'study-partner'
                          ? 'Finding available study partners...'
                          : selectedHelpType === 'study-materials'
                          ? 'Gathering emergency study materials...'
                          : 'Searching for available tutors...'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl">✓</span>
                      </div>
                      
                      <p className="text-lg font-medium">
                        {selectedHelpType === 'study-partner'
                          ? 'Found 3 study partners!'
                          : selectedHelpType === 'study-materials'
                          ? 'Emergency materials ready!'
                          : 'Found 2 available tutors!'}
                      </p>
                      
                      <button
                        className="btn-primary w-full"
                        onClick={handleCloseModal}
                      >
                        {selectedHelpType === 'study-partner'
                          ? 'Connect Now'
                          : selectedHelpType === 'study-materials'
                          ? 'View Materials'
                          : 'Connect with Tutor'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// Helper component for help type buttons
const HelpTypeButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => {
  return (
    <motion.button
      className="bg-primary-bg border border-gray-700 rounded-lg p-4 text-left flex items-center gap-4 hover:border-accent"
      whileHover={{ scale: 1.02, borderColor: '#FEDA3C' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="text-accent">{icon}</div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
    </motion.button>
  );
};

export default PanicButton;
