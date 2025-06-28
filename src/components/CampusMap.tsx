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
  const [locationData, setLocationData] = useState<{[key: string]: Location}>({});

  // Initial location data structure
  const initialLocations: {[key: string]: Omit<Location, 'lastUpdated'>} = {
    'ev': {
      id: 'ev',
      name: "EV Building",
      coordinates: [45.4952, -73.5789],
      crowdLevel: "medium",
      peopleCount: "40+"
    },
    'lb-2': {
      id: 'lb-2',
      name: "LB Library - Floor 2",
      coordinates: [45.4970, -73.5774],
      crowdLevel: "high",
      peopleCount: "55+"
    },
    'lb-3': {
      id: 'lb-3',
      name: "LB Library - Floor 3",
      coordinates: [45.4970, -73.5774],
      crowdLevel: "medium",
      peopleCount: "30+"
    },
    'lb-4': {
      id: 'lb-4',
      name: "LB Library - Floor 4",
      coordinates: [45.4970, -73.5774],
      crowdLevel: "low",
      peopleCount: "15+"
    },
    'lb-5': {
      id: 'lb-5',
      name: "LB Library - Floor 5",
      coordinates: [45.4970, -73.5774],
      crowdLevel: "low",
      peopleCount: "10+"
    },
    'hall-2': {
      id: 'hall-2',
      name: "Hall Building - Floor 2",
      coordinates: [45.4973, -73.5790],
      crowdLevel: "high",
      peopleCount: "60+"
    },
    'hall-3': {
      id: 'hall-3',
      name: "Hall Building - Floor 3",
      coordinates: [45.4973, -73.5790],
      crowdLevel: "high",
      peopleCount: "50+"
    },
    'hall-4': {
      id: 'hall-4',
      name: "Hall Building - Floor 4",
      coordinates: [45.4973, -73.5790],
      crowdLevel: "medium",
      peopleCount: "35+"
    },
    'hall-5': {
      id: 'hall-5',
      name: "Hall Building - Floor 5",
      coordinates: [45.4973, -73.5790],
      crowdLevel: "medium",
      peopleCount: "30+"
    },
    'hall-6': {
      id: 'hall-6',
      name: "Hall Building - Floor 6",
      coordinates: [45.4973, -73.5790],
      crowdLevel: "low",
      peopleCount: "15+"
    },
    'hall-7': {
      id: 'hall-7',
      name: "Hall Building - Floor 7",
      coordinates: [45.4973, -73.5790],
      crowdLevel: "low",
      peopleCount: "10+"
    },
    'mb': {
      id: 'mb',
      name: "MB Building",
      coordinates: [45.4953, -73.5798],
      crowdLevel: "low",
      peopleCount: "20+"
    },
    'fg': {
      id: 'fg',
      name: "FG Building",
      coordinates: [45.4945, -73.5780],
      crowdLevel: "low",
      peopleCount: "15+"
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

  // Function to generate varied timestamps
  const generateVariedTimestamps = () => {
    const result: {[key: string]: Location} = {};
    
    // Create a map of location IDs to varied timestamps
    const timestampMap: {[key: string]: number} = {};
    
    // Generate timestamps with more variation
    // High crowd level locations will have more recent updates (1-15 mins)
    // Medium crowd level locations will have medium recency (5-25 mins)
    // Low crowd level locations will have less recent updates (10-45 mins)
    Object.keys(initialLocations).forEach(key => {
      const location = initialLocations[key];
      let minTime = 1;
      let maxTime = 15;
      
      if (location.crowdLevel === 'medium') {
        minTime = 5;
        maxTime = 25;
      } else if (location.crowdLevel === 'low') {
        minTime = 10;
        maxTime = 45;
      }
      
      // Ensure high crowded areas don't all have the same timestamp
      if (location.crowdLevel === 'high') {
        // For high crowded areas, ensure at least 5 mins difference between timestamps
        const existingHighCrowdedTimes = Object.keys(timestampMap)
          .filter(k => initialLocations[k].crowdLevel === 'high')
          .map(k => timestampMap[k]);
        
        let time;
        do {
          time = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
        } while (existingHighCrowdedTimes.includes(time));
        
        timestampMap[key] = time;
      } else {
        timestampMap[key] = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
      }
      
      result[key] = {
        ...location,
        lastUpdated: `${timestampMap[key]} mins ago`
      };
    });
    
    return result;
  };
  
  // Initialize location data with varied timestamps
  useEffect(() => {
    // Set initial data
    setLocationData(generateVariedTimestamps());
    
    // Update timestamps every 5 minutes
    const intervalId = setInterval(() => {
      setLocationData(generateVariedTimestamps());
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

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
          Object.values(locationData).forEach(location => {
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
  }, [locationData]);

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
    const location = locationData[id];
    
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

  // Get top 3 most crowded places
  const getTopCrowdedPlaces = () => {
    // Combine all locations and sort by crowd level
    const allLocations = Object.values(locationData);
    const sortedLocations = [...allLocations].sort((a, b) => {
      const crowdLevels = { 'high': 3, 'medium': 2, 'low': 1 };
      return crowdLevels[b.crowdLevel as keyof typeof crowdLevels] - crowdLevels[a.crowdLevel as keyof typeof crowdLevels];
    });
    
    // Return top 3
    return sortedLocations.slice(0, 3);
  };
  
  const topCrowdedPlaces = getTopCrowdedPlaces();
  
  // Calculate crowd percentage for visualization
  const getCrowdPercentage = (crowdLevel: string) => {
    switch(crowdLevel) {
      case 'high': return 90;
      case 'medium': return 60;
      case 'low': return 30;
      default: return 0;
    }
  };
  
  // Get crowd level text description
  const getCrowdLevelText = (crowdLevel: string) => {
    switch(crowdLevel) {
      case 'high': return 'Crowded';
      case 'medium': return 'Moderate';
      case 'low': return 'Empty';
      default: return 'Unknown';
    }
  };
  
  // Get abbreviated location name
  const getAbbreviatedName = (name: string) => {
    // Extract building code and floor number
    if (name.includes('LB') || name.includes('Library')) {
      const floorMatch = name.match(/Floor (\d+)/);
      return `LB ${floorMatch ? floorMatch[1] : ''}`;
    } else if (name.includes('Hall')) {
      const floorMatch = name.match(/Floor (\d+)/);
      return `Hall ${floorMatch ? floorMatch[1] : ''}`;
    } else if (name.includes('MB') || name.includes('Molson')) {
      const floorMatch = name.match(/Floor (\d+)/);
      return `MB ${floorMatch ? floorMatch[1] : ''}`;
    } else if (name.includes('EV')) {
      const floorMatch = name.match(/Floor (\d+)/);
      return `EV ${floorMatch ? floorMatch[1] : ''}`;
    }
    return name;
  };
  
  // Helper function to get the appropriate CSS class for crowd level
  const getCrowdLevelClass = (crowdLevel: string) => {
    switch(crowdLevel) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`bg-secondary-bg border border-accent rounded-lg overflow-hidden ${className}`}>
      <div className="p-4 border-b border-accent">
        <h2 className="text-xl font-bold text-accent flex items-center gap-2">
          <FaMapMarkerAlt /> Campus Crowd Map
        </h2>
      </div>
      
      {/* Building menu bar */}
      <div className="flex flex-wrap gap-2 p-3 border-b border-accent bg-primary-bg">
        {Object.entries(buildings).map(([id, building]) => (
          <button 
            key={id}
            onClick={() => focusLocation(id)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeLocation === id ? 'bg-accent text-black' : 'bg-secondary-bg text-accent hover:bg-accent hover:bg-opacity-20'}`}
          >
            {building.name}
          </button>
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row h-[500px]">
        {/* Top crowded places with bars */}
        <div className="w-full md:w-64 bg-secondary-bg border-r border-accent overflow-y-auto p-3">
          <h3 className="text-lg font-bold text-accent mb-4">Top Crowded Places</h3>
          
          {topCrowdedPlaces.map((place) => (
            <div 
              key={place.id} 
              className="neon-bar-container"
              onClick={() => focusLocation(place.id)}
            >
              <div 
                className={`neon-bar neon-bar-${place.crowdLevel}`}
                style={{ width: `${getCrowdPercentage(place.crowdLevel)}%` }}
              >
                <div className="neon-bar-content">
                  <div className="neon-bar-name">{getAbbreviatedName(place.name)}</div>
                  <div className="neon-bar-level">{getCrowdLevelText(place.crowdLevel)}</div>
                  <div className="neon-bar-info">
                    <span className="neon-bar-time">{place.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Floor details section */}
          {activeLocation && activeLocation.includes('-') && (
            <div className="mt-6 p-3 bg-primary-bg rounded border border-accent">
              <h4 className="text-sm font-bold text-accent mb-2">Floor Details</h4>
              <div>
                <p className="text-sm">{locationData[activeLocation]?.name}</p>
                <p className="text-xs mt-1">People: {locationData[activeLocation]?.peopleCount}</p>
                <p className="text-xs">Updated: {locationData[activeLocation]?.lastUpdated}</p>
              </div>
            </div>
          )}
          
          {/* Building floors section - show when a building is selected */}
          {activeLocation && !activeLocation.includes('-') && buildings[activeLocation as keyof typeof buildings]?.floors?.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-bold text-accent mb-2">Floors</h4>
              <div className="ml-2">
                {buildings[activeLocation as keyof typeof buildings].floors.map(floorId => {
                  const floor = locationData[floorId];
                  const floorNumber = floorId.split('-')[1];
                  return (
                    <div 
                      key={floorId}
                      className="neon-bar-container"
                      onClick={() => focusLocation(floorId)}
                    >
                      <div 
                        className={`neon-bar neon-bar-${floor.crowdLevel}`}
                        style={{ width: `${getCrowdPercentage(floor.crowdLevel)}%` }}
                      ></div>
                      <div className="neon-bar-content">
                        <div className="neon-bar-name">{getAbbreviatedName(floor.name)}</div>
                        <div className="neon-bar-level">{getCrowdLevelText(floor.crowdLevel)}</div>
                        <div className="neon-bar-info">
                          <span className="neon-bar-time">{floor.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Map container */}
        <div className="flex-grow relative">
          <div ref={mapRef} className="w-full h-full" />
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary-bg bg-opacity-80">
              <div className="text-accent">Loading map...</div>
            </div>
          )}
          <button 
            className="absolute bottom-4 right-4 bg-primary-bg border border-accent p-2 rounded-full text-accent hover:bg-opacity-80 z-10"
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
