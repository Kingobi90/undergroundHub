import React from 'react';
import CampusMap from './CampusMap';

// Example of how to integrate the CampusMap component into the Home component
const Home = () => {
  return (
    <div className="home-container">
      {/* Existing Home content */}
      <div className="bg-secondary-bg border border-accent rounded-lg p-4 text-center lg:col-span-2" data-component-name="Home">
        <p className="text-text-secondary text-sm mb-2" data-component-name="Home">SPONSORED</p>
        <p className="text-accent font-bold" data-component-name="Home">Campus Bookstore</p>
        <p className="text-text-primary text-sm" data-component-name="Home">50% off all UG merch this week!</p>
      </div>
      
      {/* Campus Map Component */}
      <CampusMap />
      
      {/* Additional Home content would go here */}
    </div>
  );
};

export default Home;
