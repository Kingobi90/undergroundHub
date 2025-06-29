import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';

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
      <Header />
      {children}
    </>
  );
}
