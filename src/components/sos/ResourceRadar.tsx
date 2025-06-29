import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaSync, FaListUl, FaMapMarked, FaFilter, FaWifi } from 'react-icons/fa';
import Card from '../Card';

interface StudyLocation {
  id: string;
  name: string;
  type: 'library' | 'study-room' | 'cafe' | 'outdoor' | 'lab';
  currentCapacity: number;
  maxCapacity: number;
  openUntil: string;
  amenities: string[];
  coordinates: { x: number; y: number };
  distance: number; // in minutes walking
}

const ResourceRadar: React.FC = () => {
  // Mock data - in a real app this would come from an API
  const [locations, setLocations] = useState<StudyLocation[]>([
    {
      id: 'loc-1',
      name: 'Main Library - 3rd Floor',
      type: 'library',
      currentCapacity: 45,
      maxCapacity: 100,
      openUntil: '23:00',
      amenities: ['quiet', 'wifi', 'outlets', 'computers'],
      coordinates: { x: 120, y: 80 },
      distance: 5
    },
    {
      id: 'loc-2',
      name: 'Student Center Study Lounge',
      type: 'study-room',
      currentCapacity: 28,
      maxCapacity: 30,
      openUntil: '22:00',
      amenities: ['wifi', 'outlets', 'whiteboards', 'group-friendly'],
      coordinates: { x: 70, y: 110 },
      distance: 3
    },
    {
      id: 'loc-3',
      name: 'Campus Coffee Shop',
      type: 'cafe',
      currentCapacity: 15,
      maxCapacity: 40,
      openUntil: '21:00',
      amenities: ['wifi', 'outlets', 'food', 'drinks'],
      coordinates: { x: 180, y: 130 },
      distance: 8
    },
    {
      id: 'loc-4',
      name: 'Science Building Lab',
      type: 'lab',
      currentCapacity: 12,
      maxCapacity: 30,
      openUntil: '20:00',
      amenities: ['wifi', 'outlets', 'computers', 'specialized-software'],
      coordinates: { x: 50, y: 50 },
      distance: 10
    },
    {
      id: 'loc-5',
      name: 'Quad Study Area',
      type: 'outdoor',
      currentCapacity: 20,
      maxCapacity: 60,
      openUntil: '19:00', // Daylight dependent
      amenities: ['wifi', 'outlets', 'fresh-air'],
      coordinates: { x: 150, y: 40 },
      distance: 6
    }
  ]);

  // State for view mode and filters
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [filterType, setFilterType] = useState<string>('');
  const [filterAmenity, setFilterAmenity] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter locations based on filters
  const filteredLocations = locations.filter(location => {
    const matchesType = filterType === '' || location.type === filterType;
    const matchesAmenity = filterAmenity === '' || location.amenities.includes(filterAmenity);
    return matchesType && matchesAmenity;
  });

  // Sort locations by distance
  const sortedLocations = [...filteredLocations].sort((a, b) => a.distance - b.distance);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate data refresh - in a real app this would fetch from an API
    setTimeout(() => {
      // Simulate changes in capacity
      const updatedLocations = locations.map(location => ({
        ...location,
        currentCapacity: Math.max(0, Math.min(
          location.maxCapacity,
          location.currentCapacity + Math.floor(Math.random() * 11) - 5
        ))
      }));
      
      setLocations(updatedLocations);
      setIsRefreshing(false);
    }, 1000);
  };

  // Calculate capacity percentage
  const getCapacityPercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  // Get color based on capacity
  const getCapacityColor = (current: number, max: number) => {
    const percentage = getCapacityPercentage(current, max);
    
    if (percentage < 50) {
      return 'bg-green-500';
    } else if (percentage < 80) {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  };

  // Get marker size based on capacity
  const getMarkerSize = (current: number, max: number) => {
    const percentage = getCapacityPercentage(current, max);
    const baseSize = 10;
    const maxSize = 18;
    
    return baseSize + ((percentage / 100) * (maxSize - baseSize));
  };

  // Get icon for location type
  const getLocationTypeIcon = (type: StudyLocation['type']) => {
    switch (type) {
      case 'library':
        return '📚';
      case 'study-room':
        return '🏢';
      case 'cafe':
        return '☕';
      case 'outdoor':
        return '🌳';
      case 'lab':
        return '🔬';
      default:
        return '📍';
    }
  };

  // Get amenity icon
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <FaWifi title="WiFi" />;
      case 'outlets':
        return '🔌';
      case 'quiet':
        return '🤫';
      case 'computers':
        return '💻';
      case 'whiteboards':
        return '🖊️';
      case 'group-friendly':
        return '👥';
      case 'food':
        return '🍔';
      case 'drinks':
        return '🥤';
      case 'specialized-software':
        return '🖥️';
      case 'fresh-air':
        return '🌬️';
      default:
        return '✓';
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Resource Radar</h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-full ${viewMode === 'map' ? 'bg-accent text-primary-bg' : 'bg-primary-bg text-text-secondary'}`}
            aria-label="Map view"
          >
            <FaMapMarked />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-full ${viewMode === 'list' ? 'bg-accent text-primary-bg' : 'bg-primary-bg text-text-secondary'}`}
            aria-label="List view"
          >
            <FaListUl />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className={`p-2 rounded-full bg-primary-bg text-text-secondary hover:text-accent ${isRefreshing ? 'animate-spin' : ''}`}
            aria-label="Refresh data"
            disabled={isRefreshing}
          >
            <FaSync />
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="flex-1 bg-primary-bg border border-gray-700 rounded-lg px-3 py-1 text-sm text-white"
        >
          <option value="">All Types</option>
          <option value="library">Library</option>
          <option value="study-room">Study Room</option>
          <option value="cafe">Cafe</option>
          <option value="outdoor">Outdoor</option>
          <option value="lab">Lab</option>
        </select>
        
        <select
          value={filterAmenity}
          onChange={(e) => setFilterAmenity(e.target.value)}
          className="flex-1 bg-primary-bg border border-gray-700 rounded-lg px-3 py-1 text-sm text-white"
        >
          <option value="">All Amenities</option>
          <option value="wifi">WiFi</option>
          <option value="outlets">Power Outlets</option>
          <option value="quiet">Quiet Space</option>
          <option value="computers">Computers</option>
          <option value="whiteboards">Whiteboards</option>
          <option value="group-friendly">Group Friendly</option>
          <option value="food">Food Available</option>
        </select>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="relative bg-gray-800 rounded-lg h-64 overflow-hidden">
          {/* Simple campus map representation */}
          <div className="absolute inset-0 p-2">
            {/* Campus buildings representation */}
            <div className="absolute top-10 left-10 w-40 h-20 bg-gray-700 rounded-sm"></div>
            <div className="absolute top-40 left-30 w-30 h-30 bg-gray-700 rounded-sm"></div>
            <div className="absolute top-20 left-60 w-50 h-30 bg-gray-700 rounded-sm"></div>
            <div className="absolute top-100 left-120 w-40 h-20 bg-gray-700 rounded-sm"></div>
            <div className="absolute top-80 left-40 w-60 h-25 bg-gray-700 rounded-sm"></div>
            
            {/* Paths */}
            <div className="absolute top-30 left-50 w-100 h-2 bg-gray-600 rounded-full"></div>
            <div className="absolute top-50 left-30 w-2 h-80 bg-gray-600 rounded-full"></div>
            <div className="absolute top-90 left-50 w-80 h-2 bg-gray-600 rounded-full"></div>
            <div className="absolute top-50 left-130 w-2 h-40 bg-gray-600 rounded-full"></div>
            
            {/* Location markers */}
            {sortedLocations.map(location => (
              <motion.div
                key={location.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute cursor-pointer"
                style={{
                  top: `${location.coordinates.y}px`,
                  left: `${location.coordinates.x}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={location.name}
              >
                <div className="relative">
                  <div
                    className={`rounded-full ${getCapacityColor(location.currentCapacity, location.maxCapacity)}`}
                    style={{
                      width: `${getMarkerSize(location.currentCapacity, location.maxCapacity)}px`,
                      height: `${getMarkerSize(location.currentCapacity, location.maxCapacity)}px`
                    }}
                  ></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">
                    {getLocationTypeIcon(location.type)}
                  </div>
                </div>
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-secondary-bg rounded-lg p-2 text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10">
                  <p className="font-semibold">{location.name}</p>
                  <p>{location.currentCapacity}/{location.maxCapacity} seats</p>
                  <p>Open until {location.openUntil}</p>
                  <p>{location.distance} min walk</p>
                </div>
              </motion.div>
            ))}
            
            {/* Current location marker */}
            <div className="absolute bottom-10 right-10 w-6 h-6 rounded-full bg-blue-500 border-2 border-white animate-pulse"></div>
          </div>
          
          {/* Map legend */}
          <div className="absolute bottom-2 left-2 bg-secondary-bg bg-opacity-80 rounded p-1 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>&lt;50% full</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>50-80% full</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>&gt;80% full</span>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {sortedLocations.length === 0 ? (
            <p className="text-text-secondary text-center py-4">No locations match your filters</p>
          ) : (
            sortedLocations.map(location => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary-bg rounded-lg p-3 border border-gray-700"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{getLocationTypeIcon(location.type)}</span>
                      <h4 className="font-semibold">{location.name}</h4>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-secondary mt-1">
                      <FaMapMarkerAlt size={10} />
                      <span>{location.distance} min walk</span>
                      <span className="mx-1">•</span>
                      <span>Until {location.openUntil}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {location.currentCapacity}/{location.maxCapacity}
                    </div>
                    <div className="w-16 h-2 bg-gray-700 rounded-full mt-1">
                      <div
                        className={`h-full rounded-full ${getCapacityColor(location.currentCapacity, location.maxCapacity)}`}
                        style={{ width: `${getCapacityPercentage(location.currentCapacity, location.maxCapacity)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {location.amenities.map(amenity => (
                    <span
                      key={`${location.id}-${amenity}`}
                      className="text-xs bg-secondary-bg px-2 py-0.5 rounded-full flex items-center gap-1"
                      title={amenity}
                    >
                      <span>{getAmenityIcon(amenity)}</span>
                      <span className="capitalize">{amenity}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </Card>
  );
};

export default ResourceRadar;
