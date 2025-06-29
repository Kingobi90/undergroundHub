import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spotted - Underground Campus Hub',
  description: 'Anonymous campus sightings and encounters',
};

export default function SpottedPage() {
  return (
    <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-6 text-white">Campus Spotted</h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">🚧 Under Construction 🚧</h2>
        <p className="text-gray-300 mb-4">
          The anonymous campus spotted board is coming soon! 
          Share your campus sightings and missed connections while maintaining your privacy.
        </p>
        <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
          <div className="bg-yellow-400 h-full rounded-full" style={{ width: '35%' }}></div>
        </div>
        <p className="text-gray-400 mt-2 text-sm">Coming soon...</p>
      </div>
    </main>
  );
}
