"use client";

import React from 'react';
import LinkedInStyleFeed from '../../components/LinkedInStyleFeed';

export default function LiveFeedPage() {
  return (
    <main className="min-h-screen bg-primary-bg pt-20">
      <div className="bg-secondary-bg p-4 fixed top-0 w-full z-10">
        <h1 className="text-xl font-bold">UG Campus Hub</h1>
      </div>
      <LinkedInStyleFeed />
    </main>
  );
}
