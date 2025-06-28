// Initialize Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoib2JpY2h1ayIsImEiOiJjbWNmYW13M3QwNmowMm9vaGx3NzQ0dzc0In0.3kmBtUerBzbGCFC49iBPPA'; // User's Mapbox token

// Initialize map
const map = new mapboxgl.Map({
  container: 'ug-map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-73.579, 45.497],
  zoom: 16
});

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

// Add markers to map
map.on('load', () => {
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
      .addTo(map);
  });
});

// Function to center map on specific coordinates
function centerMap(coords) {
  map.flyTo({ center: coords, zoom: 17, duration: 1500 });
}

// Add Firebase integration placeholder
// This would connect to Firebase for real-time updates
function initializeFirebase() {
  // Firebase configuration would go here
  console.log("Firebase integration ready for implementation");
}

// Function to add user-reported "spotted here" pins
function addSpottedPin(coords, message) {
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.width = '15px';
  el.style.height = '15px';
  el.style.backgroundColor = '#FFFF00';
  el.style.borderRadius = '50%';
  el.style.boxShadow = '0 0 10px #FFFF00';
  el.style.border = '2px solid #000';

  const marker = new mapboxgl.Marker(el)
    .setLngLat(coords)
    .setPopup(new mapboxgl.Popup().setHTML(`
      <b>Spotted</b><br>
      ${message}<br>
      <i>Just now</i>
    `))
    .addTo(map);
  
  // Remove marker after 30 minutes
  setTimeout(() => {
    marker.remove();
  }, 30 * 60 * 1000);
}

// Example of adding a spotted pin
// Uncomment to test
// map.on('click', (e) => {
//   addSpottedPin([e.lngLat.lng, e.lngLat.lat], "Someone was spotted here!");
// });
