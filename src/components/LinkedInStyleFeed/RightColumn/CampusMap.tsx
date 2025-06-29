"use client";

import React, { useState } from 'react';
import Card from '../../Card';
import { FaMapMarkerAlt, FaSearch, FaCompass } from 'react-icons/fa';

interface Location {
  id: string;
  name: string;
  type: 'building' | 'service' | 'landmark';
  description?: string;
}

interface CampusMapProps {
  locations?: Location[];
}

const CampusMap: React.FC<CampusMapProps> = ({
  locations = [
    { id: '1', name: 'Library', type: 'building', description: 'Main campus library with 24/7 study spaces' },
    { id: '2', name: 'Student Center', type: 'building', description: 'Food court, study spaces, and student services' },
    { id: '3', name: 'Engineering Building', type: 'building', description: 'Labs, classrooms, and faculty offices' },
    { id: '4', name: 'Health Services', type: 'service', description: 'Medical care and mental health services' },
    { id: '5', name: 'Quad', type: 'landmark', description: 'Central outdoor gathering space' },
    { id: '6', name: 'Computer Science Building', type: 'building', description: 'Tech labs and CS department' },
    { id: '7', name: 'Cafeteria', type: 'service', description: 'Main dining hall with multiple food stations' },
    { id: '8', name: 'Gym', type: 'building', description: 'Fitness center, pool, and recreation facilities' }
  ]
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  // Filter locations based on search term
  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (location.description && location.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Get icon based on location type
  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'building': return '🏢';
      case 'service': return '🛎️';
      case 'landmark': return '🏛️';
      default: return '📍';
    }
  };

  return (
    <Card className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-white">Campus Map</h3>
        <button className="text-accent text-sm flex items-center">
          <FaCompass className="mr-1" /> Full Map
        </button>
      </div>
      
      {/* Search bar */}
      <div className="relative mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search locations..."
          className="w-full bg-primary-bg border border-accent-30 rounded-md p-2 pl-8 text-text-primary text-sm focus:outline-none focus:border-accent"
        />
        <FaSearch className="absolute left-2.5 top-3 text-text-secondary" />
      </div>
      
      {/* Map placeholder */}
      <div className="w-full h-40 bg-primary-bg rounded-md mb-3 relative overflow-hidden">
        {/* This would be replaced with an actual map component */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-text-secondary">
            {selectedLocation ? (
              <div className="flex flex-col items-center">
                <FaMapMarkerAlt className="text-accent text-2xl mb-1" />
                <span>{selectedLocation.name}</span>
              </div>
            ) : (
              <span>Interactive campus map</span>
            )}
          </div>
        </div>
        
        {/* Map overlay with building indicators - simplified for demo */}
        <div className="absolute inset-0">
          {/* Library */}
          <div 
            className={`absolute top-[20%] left-[30%] cursor-pointer ${selectedLocation?.id === '1' ? 'text-accent' : 'text-white'}`}
            onClick={() => setSelectedLocation(locations[0])}
          >
            <FaMapMarkerAlt />
          </div>
          
          {/* Student Center */}
          <div 
            className={`absolute top-[40%] left-[50%] cursor-pointer ${selectedLocation?.id === '2' ? 'text-accent' : 'text-white'}`}
            onClick={() => setSelectedLocation(locations[1])}
          >
            <FaMapMarkerAlt />
          </div>
          
          {/* Engineering Building */}
          <div 
            className={`absolute top-[60%] left-[20%] cursor-pointer ${selectedLocation?.id === '3' ? 'text-accent' : 'text-white'}`}
            onClick={() => setSelectedLocation(locations[2])}
          >
            <FaMapMarkerAlt />
          </div>
          
          {/* Health Services */}
          <div 
            className={`absolute top-[70%] left-[70%] cursor-pointer ${selectedLocation?.id === '4' ? 'text-accent' : 'text-white'}`}
            onClick={() => setSelectedLocation(locations[3])}
          >
            <FaMapMarkerAlt />
          </div>
        </div>
      </div>
      
      {/* Location list */}
      <div className="max-h-40 overflow-y-auto">
        {filteredLocations.length > 0 ? (
          <div className="space-y-2">
            {filteredLocations.map((location) => (
              <div 
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`p-2 rounded-md cursor-pointer ${
                  selectedLocation?.id === location.id ? 'bg-accent-30' : 'hover:bg-accent-30'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">{getLocationIcon(location.type)}</span>
                  <div>
                    <h4 className="font-medium text-white text-sm">{location.name}</h4>
                    <p className="text-xs text-text-secondary">{location.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary text-sm text-center py-2">No locations found</p>
        )}
      </div>
      
      {/* Selected location details */}
      {selectedLocation && (
        <div className="mt-3 p-2 bg-primary-bg rounded-md">
          <h4 className="font-medium text-white">{selectedLocation.name}</h4>
          <p className="text-xs text-text-secondary mt-1">{selectedLocation.description}</p>
          <div className="flex justify-between mt-2">
            <button className="text-xs text-accent">Get Directions</button>
            <button className="text-xs text-accent">View Details</button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CampusMap;
