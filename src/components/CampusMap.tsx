"use client";

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Define types for our locations
interface Location {
  id: string;
  name: string;
  coordinates: [number, number];
  crowdLevel: 'high' | 'medium' | 'low';
  peopleCount: string;
  lastUpdated: string;
}

interface CampusMapProps {
  className?: string;
}

const CampusMap: React.FC<CampusMapProps> = ({ className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<{[key: string]: any}>({});

  // Location data
  const locations: {[key: string]: Location} = {
    'ev': {
      id: 'ev',
      name: "EV Building",
      coordinates: [45.4952, -73.5789],
      crowdLevel: "medium",
      peopleCount: "40+",
      lastUpdated: "2 mins ago"
    },
    'lb-2': {
      id: 'lb-2',
      name: "LB Library - Floor 2",
      coordinates: [45.4970, -73.5774],
      crowdLevel: "high",
      peopleCount: "55+",
      lastUpdated: "3 mins ago"
    },
    'lb-3': {
      id: 'lb-3',
      name: "LB Library - Floor 3",
      coordinates: [45.4970, -73.5774],
      crowdLevel: "medium",
      peopleCount: "30+",
      lastUpdated: "4 mins ago"
    },
    'lb-4': {
      id: 'lb-4',
      name: "LB Library - Floor 4",
      coordinates: [45.4970, -73.5774],
      crowdLevel: "low",
      peopleCount: "15+",
      lastUpdated: "5 mins ago"
    },
    'lb-5': {
      id: 'lb-5',
      name: "LB Library - Floor 5",
      coordinates: [45.4970, -73.5774],
      crowdLevel: "low",
      peopleCount: "10+",
      lastUpdated: "6 mins ago"
    },
    'hall-2': {
      id: 'hall-2',
      name: "Hall Building - Floor 2",
      coordinates: [45.4973, -73.5790],
      crowdLevel: "high",
      peopleCount: "60+",
      lastUpdated: "2 mins ago"
    },
    'hall-3': {
      id: 'hall-3',
      name: "Hall Building - Floor 3",
      coordinates: [45.4973, -73.5790],
      crowdLevel: "high",
      peopleCount: "50+",
      lastUpdated: "3 mins ago"
    },
    'hall-4': {
      id: 'hall-4',
      name: "Hall Building - Floor 4",
      coordinates: [45.4973, -73.5790],
      crowdLevel: "medium",
      peopleCount: "35+",
      lastUpdated: "4 mins ago"
    },
    'hall-5': {
      id: 'hall-5',
      name: "Hall Building - Floor 5",
      coordinates: [45.4973, -73.5790],
      crowdLevel: "medium",
      peopleCount: "30+",
      lastUpdated: "5 mins ago"
    },
    'hall-6': {
      id: 'hall-6',
      name: "Hall Building - Floor 6",
      coordinates: [45.4973, -73.5790],
      crowdLevel: "low",
      peopleCount: "15+",
      lastUpdated: "6 mins ago"
    },
    'hall-7': {
      id: 'hall-7',
      name: "Hall Building - Floor 7",
      coordinates: [45.4973, -73.5790],
      crowdLevel: "low",
      peopleCount: "10+",
      lastUpdated: "7 mins ago"
    },
    'mb': {
      id: 'mb',
      name: "MB Building",
      coordinates: [45.4953, -73.5798],
      crowdLevel: "low",
      peopleCount: "20+",
      lastUpdated: "5 mins ago"
    },
    'fg': {
      id: 'fg',
      name: "FG Building",
      coordinates: [45.4945, -73.5780],
      crowdLevel: "low",
      peopleCount: "15+",
      lastUpdated: "8 mins ago"
    }
  };

  // Building groups
  const buildings = {
    'lb': {
      name: 'LB Library',
      floors: ['lb-2', 'lb-3', 'lb-4', 'lb-5'],
      crowdLevel: 'medium'
    },
    'hall': {
      name: 'Hall Building',
      floors: ['hall-2', 'hall-3', 'hall-4', 'hall-5', 'hall-6', 'hall-7'],
      crowdLevel: 'high'
    },
    'ev': {
      name: 'EV Building',
      floors: [],
      crowdLevel: 'medium'
    },
    'mb': {
      name: 'MB Building',
      floors: [],
      crowdLevel: 'low'
    },
    'fg': {
      name: 'FG Building',
      floors: [],
      crowdLevel: 'low'
    }
  };

  useEffect(() => {
    // Check if map already exists and clean it up
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
      markersRef.current = {};
    }
    
    if (mapRef.current) {
      import('leaflet').then((L) => {
        // Make sure the map container hasn't been initialized yet
        if (!leafletMapRef.current) {
          // Create map with dark theme
          const map = L.map(mapRef.current!).setView([45.4970, -73.5774], 16);
          
          // Add dark theme tiles
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
          }).addTo(map);

          // Store map reference
          leafletMapRef.current = map;
          
          // Add markers for all locations
          Object.values(locations).forEach(location => {
            addMarker(L, map, markersRef.current, location.id, location);
          });
          
          setMapLoaded(true);
        }
      });
    }
    
    // Cleanup function to remove map when component unmounts
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markersRef.current = {};
      }
    };
  }, []);

  // Function to add marker to map
  const addMarker = (L: any, map: any, markers: any, id: string, location: Location) => {
    // Create custom icon
    const icon = L.divIcon({
      className: '',
      html: `<div class="marker-icon ${location.crowdLevel}"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    
    // Create marker with popup
    const marker = L.marker(location.coordinates, {icon: icon})
      .addTo(map)
      .bindPopup(`
        <div class="custom-popup">
          <h3>${location.name}</h3>
          <p>${location.peopleCount} people here</p>
          <p><i>Updated ${location.lastUpdated}</i></p>
        </div>
      `, {
        className: 'custom-popup'
      });
    
    markers[id] = marker;
  };

  // Function to focus on a location
  const focusLocation = (id: string) => {
    setActiveLocation(id);
    
    const map = leafletMapRef.current;
    const markers = markersRef.current;
    const location = locations[id];
    
    if (!map || !markers || !location) return;
    
    // If it's a floor, use the main building marker
    const mainId = id.split('-')[0];
    const markerId = markers[id] ? id : mainId + '-2'; // Default to floor 2 if specific floor marker doesn't exist
    
    // Fly to location
    map.setView(location.coordinates, 18, {
      animate: true,
      duration: 1
    });
    
    // Open popup
    if (markers[markerId]) {
      markers[markerId].openPopup();
    }
  };

  // Toggle floors visibility
  const toggleFloors = (buildingId: string) => {
    const floorsElement = document.getElementById(`${buildingId}-floors`);
    if (floorsElement) {
      floorsElement.classList.toggle('active');
    }
  };

  return (
    <div className={`bg-secondary-bg border border-accent rounded-lg overflow-hidden ${className}`}>
      <div className="p-4 border-b border-accent">
        <h2 className="text-xl font-bold text-accent flex items-center gap-2">
          <FaMapMarkerAlt /> Campus Crowd Map
        </h2>
      </div>
      
      <div className="flex flex-col md:flex-row" style={{ height: '500px' }}>
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-full md:w-64 bg-secondary-bg border-r border-accent overflow-y-auto p-3">
            {/* LB Building with floors */}
            <div className="building-section mb-3">
              <div 
                className={`building-header flex justify-between items-center bg-primary-bg p-2 border-l-2 border-accent cursor-pointer ${activeLocation?.startsWith('lb') ? 'border-l-4' : ''}`}
                onClick={() => toggleFloors('lb')}
              >
                <span>LB Library</span>
                <span className={`crowd-level px-2 py-1 rounded text-xs font-bold ${buildings.lb.crowdLevel === 'high' ? 'bg-red-500' : buildings.lb.crowdLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                  {buildings.lb.crowdLevel.charAt(0).toUpperCase() + buildings.lb.crowdLevel.slice(1)}
                </span>
              </div>
              <div id="lb-floors" className="building-floors ml-3">
                {buildings.lb.floors.map(floorId => {
                  const floor = locations[floorId];
                  return (
                    <div 
                      key={floorId}
                      className={`floor-item flex justify-between items-center p-2 my-1 bg-primary-bg cursor-pointer ${activeLocation === floorId ? 'border-l-2 border-accent' : ''}`}
                      onClick={() => focusLocation(floorId)}
                    >
                      <span>Floor {floorId.split('-')[1]}</span>
                      <span className={`crowd-level px-2 py-1 rounded text-xs font-bold ${floor.crowdLevel === 'high' ? 'bg-red-500' : floor.crowdLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                        {floor.crowdLevel.charAt(0).toUpperCase() + floor.crowdLevel.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Hall Building with floors */}
            <div className="building-section mb-3">
              <div 
                className={`building-header flex justify-between items-center bg-primary-bg p-2 border-l-2 border-accent cursor-pointer ${activeLocation?.startsWith('hall') ? 'border-l-4' : ''}`}
                onClick={() => toggleFloors('hall')}
              >
                <span>Hall Building</span>
                <span className={`crowd-level px-2 py-1 rounded text-xs font-bold ${buildings.hall.crowdLevel === 'high' ? 'bg-red-500' : buildings.hall.crowdLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                  {buildings.hall.crowdLevel.charAt(0).toUpperCase() + buildings.hall.crowdLevel.slice(1)}
                </span>
              </div>
              <div id="hall-floors" className="building-floors ml-3">
                {buildings.hall.floors.map(floorId => {
                  const floor = locations[floorId];
                  return (
                    <div 
                      key={floorId}
                      className={`floor-item flex justify-between items-center p-2 my-1 bg-primary-bg cursor-pointer ${activeLocation === floorId ? 'border-l-2 border-accent' : ''}`}
                      onClick={() => focusLocation(floorId)}
                    >
                      <span>Floor {floorId.split('-')[1]}</span>
                      <span className={`crowd-level px-2 py-1 rounded text-xs font-bold ${floor.crowdLevel === 'high' ? 'bg-red-500' : floor.crowdLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                        {floor.crowdLevel.charAt(0).toUpperCase() + floor.crowdLevel.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Other buildings */}
            {['ev', 'mb', 'fg'].map(buildingId => {
              const building = buildings[buildingId as keyof typeof buildings];
              const location = locations[buildingId];
              return (
                <div key={buildingId} className="building-section mb-3">
                  <div 
                    className={`building-header flex justify-between items-center bg-primary-bg p-2 border-l-2 border-accent cursor-pointer ${activeLocation === buildingId ? 'border-l-4' : ''}`}
                    onClick={() => focusLocation(buildingId)}
                  >
                    <span>{building.name}</span>
                    <span className={`crowd-level px-2 py-1 rounded text-xs font-bold ${location.crowdLevel === 'high' ? 'bg-red-500' : location.crowdLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                      {location.crowdLevel.charAt(0).toUpperCase() + location.crowdLevel.slice(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Map container */}
        <div className="flex-grow relative">
          <div ref={mapRef} className="w-full h-full" />
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary-bg bg-opacity-80">
              <div className="text-accent">Loading map...</div>
            </div>
          )}
          <button 
            className="absolute top-2 right-2 z-10 bg-primary-bg text-accent p-2 rounded-full border border-accent"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? '←' : '→'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampusMap;
