import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events - Underground Campus Hub',
  description: 'Campus events and gatherings',
};

export default function EventsPage() {
  return (
    <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-6 text-white">Campus Events</h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">🚧 Under Construction 🚧</h2>
        <p className="text-gray-300 mb-4">
          We're working hard to bring you the best campus events experience.
          This section will be available soon!
        </p>
        <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
          <div className="bg-yellow-400 h-full rounded-full" style={{ width: '60%' }}></div>
        </div>
        <p className="text-gray-400 mt-2 text-sm">Coming soon...</p>
      </div>
    </main>
  );
}
