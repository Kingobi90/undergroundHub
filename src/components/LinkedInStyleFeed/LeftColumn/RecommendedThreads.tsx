"use client";

import React from 'react';
import Card from '../../Card';

interface Thread {
  id: string;
  title: string;
  preview: string;
}

interface RecommendedThreadsProps {
  threads?: Thread[];
}

const RecommendedThreads: React.FC<RecommendedThreadsProps> = ({ 
  threads = [
    {
      id: '1',
      title: 'Campus Library Extended Hours',
      preview: 'Library will be open 24/7 during finals week starting Monday!'
    },
    {
      id: '2',
      title: 'New Food Options in Student Center',
      preview: 'Vote on which new restaurant should be added to the food court'
    },
    {
      id: '3',
      title: 'Basketball Team Advances to Finals',
      preview: 'Our team defeated State College 78-65 last night!'
    },
    {
      id: '4',
      title: 'Summer Internship Opportunities',
      preview: 'Career center just posted 50+ new internships for summer'
    }
  ]
}) => {
  return (
    <Card className="mb-4">
      <h3 className="text-lg font-bold text-white mb-3">Recommended Threads</h3>
      <div className="space-y-3">
        {threads.map((thread) => (
          <div 
            key={thread.id} 
            className="p-2 hover:bg-accent-30 rounded-md cursor-pointer transition-colors"
          >
            <h4 className="font-medium text-white">{thread.title}</h4>
            <p className="text-sm text-text-secondary truncate">{thread.preview}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecommendedThreads;
