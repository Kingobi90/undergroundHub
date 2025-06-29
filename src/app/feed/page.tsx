"use client";

import React from 'react';
import Header from '@/components/Header';
import LinkedInStyleFeed from '@/components/LinkedInStyleFeed';

export default function LiveFeedPage() {
  return (
    <main className="min-h-screen bg-primary-bg">
      <Header />
      <LinkedInStyleFeed />
    </main>
  );
}
