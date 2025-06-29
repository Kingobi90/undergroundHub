"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSync } from 'react-icons/fa';
import { useSOSContext } from '../../contexts/SOSContext';

const MotivationBanner: React.FC = () => {
  const { motivationMessages, currentMotivationIndex, refreshMotivationMessage } = useSOSContext();
  const [isMounted, setIsMounted] = useState(false);
  
  // Only render content after component has mounted on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-rotate messages every 10 seconds
  useEffect(() => {
    if (!isMounted) return;
    
    const interval = setInterval(() => {
      refreshMotivationMessage();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [refreshMotivationMessage, isMounted]);

  // If not mounted yet, return a placeholder with the same dimensions
  if (!isMounted) {
    return (
      <div className="card bg-secondary-bg relative overflow-hidden">
        <div className="flex justify-between items-center">
          <div className="flex-1 py-4 px-2">
            <p className="text-center text-lg font-medium text-accent h-6">
              {/* Empty placeholder to maintain layout */}
            </p>
          </div>
          <div className="p-3 text-accent">
            <FaSync />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card bg-secondary-bg relative overflow-hidden">
      <div className="flex justify-between items-center">
        <div className="flex-1 py-4 px-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMotivationIndex}
              className="text-center text-lg font-medium text-accent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {motivationMessages[currentMotivationIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
        <motion.button
          className="p-3 text-accent hover:text-white"
          whileHover={{ scale: 1.1, rotate: 180 }}
          transition={{ duration: 0.3 }}
          onClick={refreshMotivationMessage}
          aria-label="Refresh motivation message"
        >
          <FaSync />
        </motion.button>
      </div>
    </div>
  );
};

export default MotivationBanner;
