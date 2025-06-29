import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polls - Underground Campus Hub',
  description: 'Campus community polls and surveys',
};

export default function PollsPage() {
  return (
    <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-6 text-white">Campus Polls</h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">🚧 Under Construction 🚧</h2>
        <p className="text-gray-300 mb-4">
          We're building an interactive polling system for the campus community.
          Check back soon to participate in campus polls and see real-time results!
        </p>
        <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
          <div className="bg-yellow-400 h-full rounded-full" style={{ width: '45%' }}></div>
        </div>
        <p className="text-gray-400 mt-2 text-sm">Coming soon...</p>
      </div>
    </main>
  );
}
