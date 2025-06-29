"use client";

import React from 'react';
import UnifiedFeed from '@/components/LiveFeed/UnifiedFeed/UnifiedFeed';
import Header from '@/components/Header';

export default function UnifiedFeedPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <UnifiedFeed />
      </main>
    </>
  );
}
