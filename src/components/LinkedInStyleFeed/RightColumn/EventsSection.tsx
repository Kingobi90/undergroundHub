"use client";

import React, { useState } from 'react';
import Card from '../../Card';
import { FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

interface Event {
  id: string;
  title: string;
  date: Date | string;
  location: string;
  attending?: boolean;
}

interface EventsSectionProps {
  events?: Event[];
}

const EventsSection: React.FC<EventsSectionProps> = ({
  events = [
    {
      id: '1',
      title: 'End of Semester Party',
      date: new Date(Date.now() + 86400000 * 3), // 3 days from now
      location: 'Student Center Ballroom',
      attending: false
    },
    {
      id: '2',
      title: 'Career Fair: Tech & Engineering',
      date: new Date(Date.now() + 86400000 * 5), // 5 days from now
      location: 'Engineering Building, Floor 2',
      attending: false
    },
    {
      id: '3',
      title: 'Study Group: Finals Prep',
      date: new Date(Date.now() + 86400000 * 2), // 2 days from now
      location: 'Library Study Room 204',
      attending: false
    },
    {
      id: '4',
      title: 'Campus Movie Night',
      date: new Date(Date.now() + 86400000 * 7), // 7 days from now
      location: 'Outdoor Quad',
      attending: false
    }
  ]
}) => {
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  
  const toggleAttendance = (id: string) => {
    setAttendance(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Format date
  const formatEventDate = (date: Date | string) => {
    if (!date) return '';
    
    const eventDate = typeof date === 'string' ? new Date(date) : date;
    return eventDate.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-white">Upcoming Events</h3>
        <button className="text-accent text-sm">See all</button>
      </div>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="p-2 border-b border-accent-30 last:border-0">
            <h4 className="font-medium text-white">{event.title}</h4>
            <div className="flex items-center text-text-secondary text-sm mt-1">
              <FaCalendarAlt className="mr-1" />
              <span>{formatEventDate(event.date)}</span>
            </div>
            <div className="flex items-center text-text-secondary text-sm mt-1">
              <FaMapMarkerAlt className="mr-1" />
              <span>{event.location}</span>
            </div>
            <button 
              onClick={() => toggleAttendance(event.id)}
              className={`mt-2 flex items-center text-sm ${
                attendance[event.id] ? 'text-accent' : 'text-text-secondary hover:text-accent'
              }`}
            >
              {attendance[event.id] ? (
                <>
                  <FaCheckCircle className="mr-1" /> Attending
                </>
              ) : (
                <>
                  <FaRegCircle className="mr-1" /> RSVP
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EventsSection;
