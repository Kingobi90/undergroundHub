import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Feed - Underground Campus Hub',
  description: 'Real-time campus updates, stories, and connections',
};

export default function LiveFeedPage() {
  return (
    <main className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-6 text-white">Campus Live Feed</h1>
      <div className="text-center p-8 bg-secondary-bg rounded-lg">
        <p className="text-lg">Live feed content is temporarily unavailable. Please check back later.</p>
      </div>
    </main>
  );
}
