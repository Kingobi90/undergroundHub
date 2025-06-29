import React from 'react';
import { useLiveFeed } from '../../../contexts/LiveFeedContext';
import { FaUsers, FaWifi, FaCoffee, FaPlug } from 'react-icons/fa';

const StudySpotTracker: React.FC = () => {
  const { studySpots } = useLiveFeed();
  
  // Helper function to get occupancy level color
  const getOccupancyColor = (occupancyPercentage: number) => {
    if (occupancyPercentage < 50) return 'bg-green-500';
    if (occupancyPercentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg">Study Spots</h3>
      
      {studySpots.length === 0 ? (
        <p className="text-gray-400">No study spot data available</p>
      ) : (
        studySpots.map(spot => (
          <div key={spot.id} className="bg-gray-800 rounded-lg p-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{spot.name}</h4>
                <div className="text-sm text-gray-400">{spot.location}</div>
              </div>
              <div className="text-xs font-medium px-2 py-1 rounded-full bg-gray-700">
                {spot.isOpen ? 'Open' : 'Closed'}
              </div>
            </div>
            
            {spot.isOpen && (
              <>
                <div className="mt-2 flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Occupancy</span>
                      <span>{spot.occupancyPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${getOccupancyColor(spot.occupancyPercentage)}`} 
                        style={{ width: `${spot.occupancyPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 flex gap-2 text-xs">
                  {spot.hasWifi && (
                    <div className="flex items-center text-gray-400">
                      <FaWifi className="mr-1" />
                      <span>WiFi</span>
                    </div>
                  )}
                  {spot.hasCoffee && (
                    <div className="flex items-center text-gray-400">
                      <FaCoffee className="mr-1" />
                      <span>Coffee</span>
                    </div>
                  )}
                  {spot.hasOutlets && (
                    <div className="flex items-center text-gray-400">
                      <FaPlug className="mr-1" />
                      <span>Outlets</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-400 ml-auto">
                    <FaUsers className="mr-1" />
                    <span>{spot.currentUsers}/{spot.capacity}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StudySpotTracker;
