import React, { useState } from 'react';
import { useLiveFeed } from '../../../contexts/LiveFeedContext';
import EventCard from './EventCard';
import { Event } from '../../../types/liveFeed';

const EventCalendar: React.FC = () => {
  const { events } = useLiveFeed();
  const [expanded, setExpanded] = useState(true);
  
  // Get upcoming weekend dates (Friday, Saturday, Sunday)
  const getWeekendDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 6 is Saturday
    
    // Calculate days until Friday
    const daysUntilFriday = currentDay <= 5 ? 5 - currentDay : 5 + (7 - currentDay);
    
    const friday = new Date(today);
    friday.setDate(today.getDate() + daysUntilFriday);
    
    const saturday = new Date(friday);
    saturday.setDate(friday.getDate() + 1);
    
    const sunday = new Date(friday);
    sunday.setDate(friday.getDate() + 2);
    
    return [friday, saturday, sunday];
  };
  
  const weekendDates = getWeekendDates();
  
  // Filter events for each day of the weekend
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === date.getDate() && 
             eventDate.getMonth() === date.getMonth() && 
             eventDate.getFullYear() === date.getFullYear();
    });
  };
  
  const fridayEvents = getEventsForDate(weekendDates[0]);
  const saturdayEvents = getEventsForDate(weekendDates[1]);
  const sundayEvents = getEventsForDate(weekendDates[2]);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  if (!expanded) {
    return (
      <button 
        onClick={() => setExpanded(true)}
        className="w-full bg-gray-800 text-white font-bold py-2 px-4 rounded flex justify-between items-center"
      >
        <span>WEEKEND PLANNER</span>
        <span>▼</span>
      </button>
    );
  }

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button 
        onClick={() => setExpanded(false)}
        className="w-full bg-gray-800 text-white font-bold py-2 px-4 flex justify-between items-center"
      >
        <span>WEEKEND PLANNER</span>
        <span>▲</span>
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Friday */}
        <div className="border-r border-gray-700 p-4">
          <h3 className="text-lg font-bold mb-3">{formatDate(weekendDates[0])}</h3>
          {fridayEvents.length > 0 ? (
            <div className="space-y-3">
              {fridayEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No events scheduled</p>
          )}
        </div>
        
        {/* Saturday */}
        <div className="border-r border-gray-700 p-4">
          <h3 className="text-lg font-bold mb-3">{formatDate(weekendDates[1])}</h3>
          {saturdayEvents.length > 0 ? (
            <div className="space-y-3">
              {saturdayEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No events scheduled</p>
          )}
        </div>
        
        {/* Sunday */}
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3">{formatDate(weekendDates[2])}</h3>
          {sundayEvents.length > 0 ? (
            <div className="space-y-3">
              {sundayEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No events scheduled</p>
          )}
        </div>
      </div>
      
      <div className="bg-gray-800 p-3 flex justify-center">
        <button className="bg-yellow-400 text-black font-bold py-1 px-4 rounded">
          + POST NEW EVENT
        </button>
      </div>
    </div>
  );
};

export default EventCalendar;
