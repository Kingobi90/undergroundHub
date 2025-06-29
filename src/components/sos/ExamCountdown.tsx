import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaMapMarkerAlt, FaStickyNote } from 'react-icons/fa';
import { useSOSContext, Exam } from '../../contexts/SOSContext';
import Card from '../Card';

const ExamCountdown: React.FC = () => {
  const { exams, addExam, editExam, deleteExam } = useSOSContext();
  const [showModal, setShowModal] = useState(false);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [timeLeft, setTimeLeft] = useState<{[key: string]: {days: number, hours: number, minutes: number, seconds: number}}>(
    {}
  );

  // Form state
  const [formData, setFormData] = useState<{
    id: string;
    courseCode: string;
    courseName: string;
    examType: 'midterm' | 'final' | 'quiz' | 'other';
    date: string;
    time: string;
    location: string;
    notes: string;
  }>({
    id: '',
    courseCode: '',
    courseName: '',
    examType: 'final',
    date: '',
    time: '',
    location: '',
    notes: ''
  });

  // Calculate time remaining for each exam
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const newTimeLeft: {[key: string]: {days: number, hours: number, minutes: number, seconds: number}} = {};
      
      exams.forEach(exam => {
        const examTime = new Date(exam.dateTime).getTime();
        const difference = examTime - now.getTime();
        
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          newTimeLeft[exam.id] = { days, hours, minutes, seconds };
        } else {
          newTimeLeft[exam.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });
      
      setTimeLeft(newTimeLeft);
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [exams]);

  // Sort exams by nearest date
  const sortedExams = [...exams].sort((a, b) => {
    return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
  });

  // Get color based on proximity
  const getTimeColor = (examId: string) => {
    const time = timeLeft[examId];
    if (!time) return 'text-text-secondary';
    
    if (time.days === 0 && time.hours < 12) {
      return 'text-red-500'; // Less than 12 hours
    } else if (time.days === 0) {
      return 'text-orange-500'; // Less than 1 day
    } else if (time.days <= 2) {
      return 'text-yellow-500'; // Less than 3 days
    } else if (time.days <= 7) {
      return 'text-accent'; // Less than a week
    } else {
      return 'text-green-500'; // More than a week
    }
  };

  // Handle opening modal for new exam
  const handleAddExam = () => {
    setCurrentExam(null);
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setFormData({
      id: '',
      courseCode: '',
      courseName: '',
      examType: 'final',
      date: tomorrow.toISOString().split('T')[0],
      time: '12:00',
      location: '',
      notes: ''
    });
    
    setShowModal(true);
  };

  // Handle opening modal for editing exam
  const handleEditExam = (exam: Exam) => {
    setCurrentExam(exam);
    
    const date = new Date(exam.dateTime);
    
    setFormData({
      id: exam.id,
      courseCode: exam.courseCode,
      courseName: exam.courseName,
      examType: exam.examType,
      date: date.toISOString().split('T')[0],
      time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
      location: exam.location || '',
      notes: exam.notes || ''
    });
    
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    
    const examData: Exam = {
      id: currentExam ? currentExam.id : `exam-${Date.now()}`,
      courseCode: formData.courseCode,
      courseName: formData.courseName,
      examType: formData.examType,
      dateTime,
      location: formData.location || undefined,
      notes: formData.notes || undefined
    };
    
    if (currentExam) {
      editExam(currentExam.id, examData);
    } else {
      addExam(examData);
    }
    
    setShowModal(false);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Format time display
  const formatTimeDisplay = (time: {days: number, hours: number, minutes: number, seconds: number}) => {
    if (time.days > 0) {
      return `${time.days}d ${time.hours}h ${time.minutes}m`;
    } else if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m ${time.seconds}s`;
    } else {
      return `${time.minutes}m ${time.seconds}s`;
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Exam Countdown</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddExam}
          className="btn-secondary rounded-full p-2"
          aria-label="Add new exam"
        >
          <FaPlus />
        </motion.button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {sortedExams.length === 0 ? (
          <p className="text-text-secondary text-center py-4">No exams scheduled. Add your first exam!</p>
        ) : (
          sortedExams.map(exam => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary-bg rounded-lg p-3 border border-gray-700"
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">{exam.courseCode}</h4>
                  <p className="text-sm text-text-secondary">{exam.courseName}</p>
                  <p className="text-sm text-text-secondary capitalize">{exam.examType}</p>
                </div>
                
                <div className="text-right">
                  <div className={`font-bold ${getTimeColor(exam.id)}`}>
                    {timeLeft[exam.id] ? (
                      <motion.span
                        key={`${exam.id}-${timeLeft[exam.id]?.days}-${timeLeft[exam.id]?.hours}`}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {formatTimeDisplay(timeLeft[exam.id])}
                      </motion.span>
                    ) : 'Loading...'}
                  </div>
                  <p className="text-xs text-text-secondary">
                    {new Date(exam.dateTime).toLocaleDateString()} at {new Date(exam.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              {(exam.location || exam.notes) && (
                <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-text-secondary">
                  {exam.location && (
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt size={10} />
                      <span>{exam.location}</span>
                    </div>
                  )}
                  {exam.notes && (
                    <div className="flex items-center gap-1 mt-1">
                      <FaStickyNote size={10} />
                      <span>{exam.notes}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEditExam(exam)}
                  className="p-1 text-text-secondary hover:text-accent"
                  aria-label="Edit exam"
                >
                  <FaEdit size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteExam(exam.id)}
                  className="p-1 text-text-secondary hover:text-red-500"
                  aria-label="Delete exam"
                >
                  <FaTrash size={14} />
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Exam Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-secondary-bg p-6 rounded-lg w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                {currentExam ? 'Edit Exam' : 'Add New Exam'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="courseCode" className="block text-sm font-medium text-text-secondary mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    id="courseCode"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    required
                    className="w-full bg-primary-bg border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="e.g. CS101"
                  />
                </div>
                
                <div>
                  <label htmlFor="courseName" className="block text-sm font-medium text-text-secondary mb-1">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    id="courseName"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    required
                    className="w-full bg-primary-bg border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="e.g. Introduction to Computer Science"
                  />
                </div>
                
                <div>
                  <label htmlFor="examType" className="block text-sm font-medium text-text-secondary mb-1">
                    Exam Type
                  </label>
                  <select
                    id="examType"
                    name="examType"
                    value={formData.examType}
                    onChange={handleChange}
                    className="w-full bg-primary-bg border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="midterm">Midterm</option>
                    <option value="final">Final</option>
                    <option value="quiz">Quiz</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="date" className="block text-sm font-medium text-text-secondary mb-1">
                      Date *
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full bg-primary-bg border border-gray-600 rounded px-9 py-2 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <label htmlFor="time" className="block text-sm font-medium text-text-secondary mb-1">
                      Time *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full bg-primary-bg border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-text-secondary mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-3 text-text-secondary" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-primary-bg border border-gray-600 rounded px-9 py-2 text-white"
                      placeholder="e.g. Room 101, Building A"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-text-secondary mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-primary-bg border border-gray-600 rounded px-3 py-2 text-white resize-none"
                    placeholder="Any additional information..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {currentExam ? 'Update' : 'Add'} Exam
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ExamCountdown;
