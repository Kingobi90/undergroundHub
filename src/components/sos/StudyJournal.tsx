import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTrash, FaPlus, FaSmile, FaMeh, FaFrown, FaLightbulb, FaStar } from 'react-icons/fa';
import { useSOSContext, Task, JournalEntry } from '../../contexts/SOSContext';
import Card from '../Card';

const StudyJournal: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    toggleTask, 
    deleteTask, 
    journalEntries, 
    addJournalEntry, 
    editJournalEntry 
  } = useSOSContext();
  
  // Local state
  const [activeTab, setActiveTab] = useState<'tasks' | 'journal'>('tasks');
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [journalContent, setJournalContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<'confused' | 'neutral' | 'confident' | 'stressed' | 'proud'>('neutral');
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentJournalEntry, setCurrentJournalEntry] = useState<JournalEntry | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Sort tasks by priority and completion status
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Find today's journal entry or create a new one
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEntry = journalEntries.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
    
    if (todayEntry) {
      setCurrentJournalEntry(todayEntry);
      setJournalContent(todayEntry.content);
      setSelectedMood(todayEntry.mood || 'neutral');
    } else {
      setCurrentJournalEntry(null);
      setJournalContent('');
      setSelectedMood('neutral');
    }
  }, [journalEntries]);

  // Auto-save journal entry every 30 seconds
  useEffect(() => {
    if (activeTab === 'journal' && journalContent.trim() !== '') {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      const timer = setTimeout(() => {
        saveJournalEntry();
      }, 30000); // 30 seconds
      
      setAutoSaveTimer(timer);
    }
    
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [journalContent, activeTab]);

  // Handle adding a new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTaskText.trim() === '') return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false,
      priority: newTaskPriority
    };
    
    addTask(newTask);
    setNewTaskText('');
    setNewTaskPriority('medium');
  };

  // Handle saving journal entry
  const saveJournalEntry = () => {
    if (journalContent.trim() === '') return;
    
    const today = new Date();
    
    if (currentJournalEntry) {
      // Update existing entry
      const updatedEntry: JournalEntry = {
        ...currentJournalEntry,
        content: journalContent,
        mood: selectedMood
      };
      
      editJournalEntry(currentJournalEntry.id, updatedEntry);
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: `journal-${Date.now()}`,
        date: today,
        content: journalContent,
        mood: selectedMood
      };
      
      addJournalEntry(newEntry);
      setCurrentJournalEntry(newEntry);
    }
  };

  // Get priority color
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low':
        return 'border-green-500';
      case 'medium':
        return 'border-yellow-500';
      case 'high':
        return 'border-red-500';
      default:
        return 'border-yellow-500';
    }
  };

  // Get mood icon
  const getMoodIcon = (mood: 'confused' | 'neutral' | 'confident' | 'stressed' | 'proud') => {
    switch (mood) {
      case 'confused':
        return <FaFrown className="text-blue-400" />;
      case 'neutral':
        return <FaMeh className="text-gray-400" />;
      case 'confident':
        return <FaSmile className="text-green-400" />;
      case 'stressed':
        return <FaFrown className="text-red-400" />;
      case 'proud':
        return <FaStar className="text-yellow-400" />;
      default:
        return <FaMeh className="text-gray-400" />;
    }
  };

  return (
    <Card className={`transition-all duration-300 ${isExpanded ? 'h-96' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Study Journal</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-text-secondary hover:text-accent"
          aria-label={isExpanded ? "Collapse journal" : "Expand journal"}
        >
          {isExpanded ? '−' : '+'}
        </motion.button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-4">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === 'tasks'
              ? 'text-accent border-b-2 border-accent'
              : 'text-text-secondary hover:text-white'
          }`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === 'journal'
              ? 'text-accent border-b-2 border-accent'
              : 'text-text-secondary hover:text-white'
          }`}
          onClick={() => setActiveTab('journal')}
        >
          Journal
        </button>
      </div>

      {/* Tasks Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'tasks' && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`${isExpanded ? 'h-72' : 'h-48'} overflow-y-auto pr-1`}
          >
            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 bg-primary-bg border border-gray-700 rounded px-3 py-1 text-white"
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="bg-primary-bg border border-gray-700 rounded px-2 py-1 text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="p-1 bg-accent text-primary-bg rounded-full"
                aria-label="Add task"
              >
                <FaPlus />
              </motion.button>
            </form>

            {/* Tasks List */}
            <div className="space-y-2">
              {sortedTasks.length === 0 ? (
                <p className="text-text-secondary text-center py-4">No tasks yet. Add your first task!</p>
              ) : (
                sortedTasks.map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-center gap-2 p-2 border-l-4 rounded bg-primary-bg ${
                      task.completed
                        ? 'border-gray-600 opacity-60'
                        : getPriorityColor(task.priority)
                    }`}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleTask(task.id, !task.completed)}
                      className={`w-5 h-5 flex-shrink-0 border rounded-sm ${
                        task.completed
                          ? 'bg-accent border-accent text-primary-bg'
                          : 'border-gray-500'
                      } flex items-center justify-center`}
                      aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {task.completed && <FaCheck size={12} />}
                    </motion.button>
                    
                    <span className={`flex-1 ${task.completed ? 'line-through text-text-secondary' : ''}`}>
                      {task.text}
                    </span>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTask(task.id)}
                      className="text-text-secondary hover:text-red-500"
                      aria-label="Delete task"
                    >
                      <FaTrash size={14} />
                    </motion.button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Journal Tab */}
        {activeTab === 'journal' && (
          <motion.div
            key="journal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Mood Selection */}
            <div className="flex justify-center mb-3">
              <div className="flex bg-primary-bg rounded-full p-1">
                <MoodButton
                  mood="confused"
                  selected={selectedMood === 'confused'}
                  onClick={() => setSelectedMood('confused')}
                  icon={<FaFrown />}
                  label="Confused"
                />
                <MoodButton
                  mood="stressed"
                  selected={selectedMood === 'stressed'}
                  onClick={() => setSelectedMood('stressed')}
                  icon={<FaFrown />}
                  label="Stressed"
                />
                <MoodButton
                  mood="neutral"
                  selected={selectedMood === 'neutral'}
                  onClick={() => setSelectedMood('neutral')}
                  icon={<FaMeh />}
                  label="Neutral"
                />
                <MoodButton
                  mood="confident"
                  selected={selectedMood === 'confident'}
                  onClick={() => setSelectedMood('confident')}
                  icon={<FaSmile />}
                  label="Confident"
                />
                <MoodButton
                  mood="proud"
                  selected={selectedMood === 'proud'}
                  onClick={() => setSelectedMood('proud')}
                  icon={<FaStar />}
                  label="Proud"
                />
              </div>
            </div>

            {/* Journal Entry */}
            <div className={`${isExpanded ? 'h-64' : 'h-32'}`}>
              <textarea
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder="Write your thoughts, insights, or study notes here..."
                className="w-full h-full bg-primary-bg border border-gray-700 rounded p-3 text-white resize-none"
                onBlur={saveJournalEntry}
              />
            </div>

            <div className="flex justify-between items-center mt-2 text-xs text-text-secondary">
              <div className="flex items-center gap-1">
                <FaLightbulb />
                <span>Tip: Journal entries are saved automatically every 30 seconds</span>
              </div>
              <button
                onClick={saveJournalEntry}
                className="text-accent hover:underline"
              >
                Save Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// Helper component for mood buttons
const MoodButton: React.FC<{
  mood: 'confused' | 'neutral' | 'confident' | 'stressed' | 'proud';
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ mood, selected, onClick, icon, label }) => {
  // Get color based on mood
  const getMoodColor = () => {
    switch (mood) {
      case 'confused':
        return 'bg-blue-500';
      case 'neutral':
        return 'bg-gray-500';
      case 'confident':
        return 'bg-green-500';
      case 'stressed':
        return 'bg-red-500';
      case 'proud':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`p-2 rounded-full mx-1 ${
        selected ? getMoodColor() : 'bg-secondary-bg'
      }`}
      title={label}
      aria-label={`Set mood to ${label}`}
    >
      {icon}
    </motion.button>
  );
};

export default StudyJournal;
