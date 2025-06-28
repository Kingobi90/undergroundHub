# UG Campus Crowd Map

A dark-themed Mapbox application that displays real-time crowd levels at various campus buildings. The application features a sidebar ranking buildings by how busy they are and interactive markers on the map.

## Features

- Dark-themed Mapbox map with campus buildings
- Color-coded markers indicating crowd density (red, orange, green)
- Sidebar with clickable building list and crowd level indicators
- Interactive popups showing detailed crowd information
- Prepared for Firebase integration for real-time updates
- Support for temporary "Spotted here" pins

## Setup

1. Replace the Mapbox access token in `script.js` with your own token:
   ```javascript
   mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN_HERE';
   ```

2. Open `index.html` in a web browser to view the application.

## Firebase Integration

The application is prepared for Firebase integration. To enable real-time updates:

1. Create a Firebase project
2. Add your Firebase configuration to `script.js`
3. Implement the `initializeFirebase()` function

## Adding "Spotted Here" Pins

The application includes functionality for temporary pins that disappear after 30 minutes. To enable user-generated pins, uncomment the click event listener in `script.js`:

```javascript
map.on('click', (e) => {
  addSpottedPin([e.lngLat.lng, e.lngLat.lat], "Someone was spotted here!");
});
```

## Customization

- Add more buildings by extending the `locations` array in `script.js`
- Modify the styling in `styles.css` to match your application's theme
- Adjust the pulse animation timing for different marker types
