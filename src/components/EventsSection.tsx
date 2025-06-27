import React from 'react';
import Card from './Card';

interface Event {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
}

interface EventsSectionProps {
  events: Event[];
}

const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  return (
    <div className="space-y-6">
      <h2 className="section-header">
        <span>🎉 UPCOMING EVENTS</span>
      </h2>
      
      <Card>
        <div className="divide-y divide-gray-800">
          {events.map((event) => (
            <div key={event.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-base font-bold text-text-primary">{event.title}</h3>
                <span className="text-xs text-accent bg-accent bg-opacity-20 px-2 py-1 rounded-full">
                  {event.timestamp}
                </span>
              </div>
              
              {event.location && (
                <p className="text-sm text-text-primary flex items-center">
                  <span className="text-accent mr-2">📍</span>
                  {event.location}
                </p>
              )}
              
              <p className="text-sm text-text-secondary">{event.description}</p>
              
              <button className="btn btn-sm bg-purple-600 text-white hover:bg-purple-700">
                RSVP
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default EventsSection;
