import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Feed - Underground Campus Hub',
  description: 'Real-time campus updates, stories, and connections',
};

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="bg-secondary-bg p-4 fixed top-0 w-full z-10">
        <h1 className="text-xl font-bold">UG Campus Hub</h1>
      </div>
      {children}
    </>
  );
}
