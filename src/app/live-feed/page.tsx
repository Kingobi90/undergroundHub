import React from 'react';
import { Metadata } from 'next';
import LiveFeedSection from '@/components/LiveFeedSection';

export const metadata: Metadata = {
  title: 'Live Feed - Underground Campus Hub',
  description: 'Real-time campus updates, stories, and connections',
};

export default function LiveFeedPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Campus Live Feed</h1>
      <LiveFeedSection userId="user123" />
    </main>
  );
}
