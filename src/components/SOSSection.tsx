import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { SOSProvider } from '@/contexts/SOSContext';
import MotivationBanner from '@/components/sos/MotivationBanner';
import PomodoroTimer from '@/components/sos/PomodoroTimer';
import ExamCountdown from '@/components/sos/ExamCountdown';
import PanicButton from '@/components/sos/PanicButton';
import StudyMaterialsGrid from '@/components/sos/StudyMaterialsGrid';
import ActiveEmergencies from '@/components/sos/ActiveEmergencies';
import ResourceRadar from '@/components/sos/ResourceRadar';
import StudyJournal from '@/components/sos/StudyJournal';

interface SOSSectionProps {
  userId?: string;
  courseList?: {
    id: string;
    code: string;
    name: string;
  }[];
}

const SOSSection: React.FC<SOSSectionProps> = ({ userId = "user-123", courseList = [
  { id: "course-1", code: "CS101", name: "Introduction to Computer Science" },
  { id: "course-2", code: "MATH202", name: "Calculus II" },
  { id: "course-3", code: "PHYS101", name: "Physics I" },
  { id: "course-4", code: "ENG205", name: "Creative Writing" },
  { id: "course-5", code: "BIO110", name: "Biology Fundamentals" }
] }) => {
  // Animation variants for the pulsing SOS icon
  const pulseAnimation = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <SOSProvider>
      <section className="w-full py-6">
        <div className="container mx-auto px-4">
          {/* Section Header with Pulsing Icon */}
          <div className="section-header mb-6">
            <motion.div
              variants={pulseAnimation}
              animate="pulse"
              className="text-accent"
            >
              <FaExclamationTriangle size={24} />
            </motion.div>
            <h2 className="text-accent">SOS STUDY EMERGENCY</h2>
          </div>

          {/* Motivation Banner */}
          <div className="mb-6">
            <MotivationBanner />
          </div>

          {/* Active Emergencies - Moved right under Motivation Banner */}
          <div className="mb-6">
            <ActiveEmergencies userId={userId} />
          </div>

          {/* Main Grid Layout - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="space-y-6">
              <PomodoroTimer 
                defaultFocusTime={25}
                defaultShortBreak={5}
                defaultLongBreak={15}
                sessionsBeforeLongBreak={4}
              />
              <PanicButton userId={userId} />
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <ExamCountdown />
              <StudyMaterialsGrid courseList={courseList} />
            </div>

            {/* Column 3 */}
            <div className="space-y-6">
              <StudyJournal />
              <div className="md:col-span-2 lg:col-span-1">
                <ResourceRadar />
              </div>
            </div>
          </div>

          {/* Full Width Components - Active Emergencies moved above */}
        </div>
      </section>
    </SOSProvider>
  );
};

export default SOSSection;
