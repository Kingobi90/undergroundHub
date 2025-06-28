import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './CampusMap.css';

const CampusMap = () => {
  const mapContainer = useRef(null);
  const sidebarRef = useRef(null);
  const map = useRef(null);

  // Location data
  const locations = [
    {
      name: "EV Building",
      coords: [-73.5788, 45.4969],
      density: "high",
      crowdCount: 60,
      lastUpdated: "2 mins ago"
    },
    {
      name: "LB Library",
      coords: [-73.5795, 45.4955],
      density: "moderate",
      crowdCount: 35,
      lastUpdated: "3 mins ago"
    },
    {
      name: "MB Building",
      coords: [-73.5770, 45.4945],
      density: "low",
      crowdCount: 10,
      lastUpdated: "5 mins ago"
    }
  ];

  // Get color based on crowd density
  const getColor = (density) => {
    if (density === "high") return "#FF0000";
    if (density === "moderate") return "#FFA500";
    return "#00FF00";
  };

  // Center map on specific coordinates
  const centerMap = (coords) => {
    if (map.current) {
      map.current.flyTo({ center: coords, zoom: 17, duration: 1500 });
    }
  };

  useEffect(() => {
    // Initialize Mapbox
    mapboxgl.accessToken = 'pk.eyJ1Ijoib2JpY2h1ayIsImEiOiJjbWNmYW13M3QwNmowMm9vaGx3NzQ0dzc0In0.3kmBtUerBzbGCFC49iBPPA'; // User's Mapbox token
    
    if (map.current) return; // Initialize map only once
    
    // Create map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-73.579, 45.497],
      zoom: 16
    });

    // Add markers when map loads
    map.current.on('load', () => {
      locations.forEach(loc => {
        // Create marker element
        const el = document.createElement('div');
        el.className = `marker ${loc.density}`;
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.backgroundColor = getColor(loc.density);
        el.style.borderRadius = '50%';
        el.style.boxShadow = `0 0 10px ${getColor(loc.density)}`;
        el.style.border = '2px solid #000';

        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat(loc.coords)
          .setPopup(new mapboxgl.Popup().setHTML(`
            <b>${loc.name}</b><br>
            ${loc.crowdCount}+ people here<br>
            <i>Reported ${loc.lastUpdated}</i>
          `))
          .addTo(map.current);
      });
    });

    // Cleanup on unmount
    return () => map.current.remove();
  }, []);

  return (
    <div className="campus-map-container">
      {/* Sidebar */}
      <div className="campus-map-sidebar" ref={sidebarRef}>
        <h2><span className="campus-map-icon">🏢</span> Crowd Levels</h2>
        {locations.map((location, index) => (
          <div 
            key={index} 
            className="campus-map-location-item" 
            onClick={() => centerMap(location.coords)}
          >
            <span className="campus-map-location-name">{location.name}</span>
            <div className="campus-map-crowd-bar">
              <div 
                className={`campus-map-crowd-level ${location.density}`} 
                style={{ width: location.density === 'high' ? '80%' : location.density === 'moderate' ? '50%' : '25%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="campus-map" ref={mapContainer}></div>
    </div>
  );
};

export default CampusMap;
