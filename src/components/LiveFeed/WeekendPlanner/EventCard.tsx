import React from 'react';
import { Event } from '../../../types/liveFeed';
import { FaUsers, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import Card from '../../Card';

interface Props {
  event: Event;
}

const EventCard: React.FC<Props> = ({ event }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <Card className={`hover:bg-gray-800 transition-colors cursor-pointer ${event.isOfficial ? 'border-yellow-400' : ''}`}>
      <div className="flex flex-col">
        <h4 className="font-bold text-lg">{event.title}</h4>
        
        <div className="flex items-center text-sm text-gray-400 mb-2">
          <FaClock className="mr-1" />
          <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-400 mb-2">
          <FaMapMarkerAlt className="mr-1" />
          <span>{event.location}</span>
        </div>
        
        {event.bannerImageUrl && (
          <div className="my-2 rounded overflow-hidden">
            <img 
              src={event.bannerImageUrl} 
              alt={event.title} 
              className="w-full h-24 object-cover"
            />
          </div>
        )}
        
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center text-sm text-gray-400">
            <FaUsers className="mr-1" />
            <span>{event.attendees} attending</span>
          </div>
          
          {event.isOfficial && (
            <div className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full font-medium">
              OFFICIAL
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
