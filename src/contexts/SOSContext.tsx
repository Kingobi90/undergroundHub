"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Course {
  id: string;
  code: string;
  name: string;
}

export interface Exam {
  id: string;
  courseCode: string;
  courseName: string;
  examType: 'midterm' | 'final' | 'quiz' | 'other';
  dateTime: Date;
  location?: string;
  notes?: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  courseId?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood?: 'confused' | 'neutral' | 'confident' | 'stressed' | 'proud';
  courseId?: string;
}

export interface SessionData {
  type: 'focus' | 'shortBreak' | 'longBreak';
  duration: number;
  completedAt: Date;
  associatedCourse?: string;
}

interface SOSContextType {
  // Exams
  exams: Exam[];
  addExam: (exam: Exam) => void;
  editExam: (id: string, exam: Exam) => void;
  deleteExam: (id: string) => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Task) => void;
  toggleTask: (id: string, completed: boolean) => void;
  deleteTask: (id: string) => void;
  
  // Journal Entries
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  editJournalEntry: (id: string, entry: JournalEntry) => void;
  
  // Pomodoro Settings
  pomodoroSettings: {
    focusTime: number;
    shortBreakTime: number;
    longBreakTime: number;
    sessionsBeforeLongBreak: number;
  };
  updatePomodoroSettings: (settings: {
    focusTime?: number;
    shortBreakTime?: number;
    longBreakTime?: number;
    sessionsBeforeLongBreak?: number;
  }) => void;
  
  // Session History
  sessionHistory: SessionData[];
  addSessionData: (data: SessionData) => void;
  
  // Motivation Messages
  motivationMessages: string[];
  currentMotivationIndex: number;
  refreshMotivationMessage: () => void;
}

const defaultPomodoroSettings = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  sessionsBeforeLongBreak: 4,
};

const motivationalMessages = [
  "You've got this! One step at a time.",
  "Every minute of studying counts. Keep going!",
  "Your future self will thank you for studying now.",
  "Difficult roads often lead to beautiful destinations.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The expert in anything was once a beginner.",
  "Don't wish it were easier; wish you were better.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Your only limit is your mind.",
  "Believe you can and you're halfway there.",
  "The best way to predict your future is to create it.",
  "Don't stop when you're tired; stop when you're done.",
  "Dream big, work hard, stay focused.",
  "Your time is limited, don't waste it living someone else's life.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "It always seems impossible until it's done.",
  "The difference between ordinary and extraordinary is that little extra.",
  "Don't watch the clock; do what it does. Keep going."
];

const SOSContext = createContext<SOSContextType | undefined>(undefined);

export const SOSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load data from localStorage on component mount
  const [exams, setExams] = useState<Exam[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [pomodoroSettings, setPomodoroSettings] = useState(defaultPomodoroSettings);
  const [sessionHistory, setSessionHistory] = useState<SessionData[]>([]);
  const [currentMotivationIndex, setCurrentMotivationIndex] = useState(
    Math.floor(Math.random() * motivationalMessages.length)
  );

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedExams = localStorage.getItem('sos_exams');
      if (storedExams) {
        // Convert string dates back to Date objects
        const parsedExams = JSON.parse(storedExams).map((exam: any) => ({
          ...exam,
          dateTime: new Date(exam.dateTime)
        }));
        setExams(parsedExams);
      }

      const storedTasks = localStorage.getItem('sos_tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
        setTasks(parsedTasks);
      }

      const storedJournalEntries = localStorage.getItem('sos_journal');
      if (storedJournalEntries) {
        const parsedEntries = JSON.parse(storedJournalEntries).map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
        setJournalEntries(parsedEntries);
      }

      const storedPomodoroSettings = localStorage.getItem('sos_pomodoro_settings');
      if (storedPomodoroSettings) {
        setPomodoroSettings(JSON.parse(storedPomodoroSettings));
      }

      const storedSessionHistory = localStorage.getItem('sos_session_history');
      if (storedSessionHistory) {
        const parsedHistory = JSON.parse(storedSessionHistory).map((session: any) => ({
          ...session,
          completedAt: new Date(session.completedAt)
        }));
        setSessionHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Error loading SOS data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sos_exams', JSON.stringify(exams));
      localStorage.setItem('sos_tasks', JSON.stringify(tasks));
      localStorage.setItem('sos_journal', JSON.stringify(journalEntries));
      localStorage.setItem('sos_pomodoro_settings', JSON.stringify(pomodoroSettings));
      localStorage.setItem('sos_session_history', JSON.stringify(sessionHistory));
    } catch (error) {
      console.error('Error saving SOS data to localStorage:', error);
    }
  }, [exams, tasks, journalEntries, pomodoroSettings, sessionHistory]);

  // Exams functions
  const addExam = (exam: Exam) => {
    setExams(prev => [...prev, exam]);
  };

  const editExam = (id: string, updatedExam: Exam) => {
    setExams(prev => prev.map(exam => exam.id === id ? updatedExam : exam));
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(exam => exam.id !== id));
  };

  // Tasks functions
  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const toggleTask = (id: string, completed: boolean) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, completed } : task));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Journal functions
  const addJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => [...prev, entry]);
  };

  const editJournalEntry = (id: string, updatedEntry: JournalEntry) => {
    setJournalEntries(prev => prev.map(entry => entry.id === id ? updatedEntry : entry));
  };

  // Pomodoro settings
  const updatePomodoroSettings = (settings: {
    focusTime?: number;
    shortBreakTime?: number;
    longBreakTime?: number;
    sessionsBeforeLongBreak?: number;
  }) => {
    setPomodoroSettings(prev => ({ ...prev, ...settings }));
  };

  // Session history
  const addSessionData = (data: SessionData) => {
    setSessionHistory(prev => [...prev, data]);
  };

  // Motivation message
  const refreshMotivationMessage = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * motivationalMessages.length);
    } while (newIndex === currentMotivationIndex && motivationalMessages.length > 1);
    
    setCurrentMotivationIndex(newIndex);
  };

  const value = {
    exams,
    addExam,
    editExam,
    deleteExam,
    
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    
    journalEntries,
    addJournalEntry,
    editJournalEntry,
    
    pomodoroSettings,
    updatePomodoroSettings,
    
    sessionHistory,
    addSessionData,
    
    motivationMessages: motivationalMessages,
    currentMotivationIndex,
    refreshMotivationMessage,
  };

  return (
    <SOSContext.Provider value={value}>
      {children}
    </SOSContext.Provider>
  );
};

export const useSOSContext = () => {
  const context = useContext(SOSContext);
  if (context === undefined) {
    throw new Error('useSOSContext must be used within a SOSProvider');
  }
  return context;
};
