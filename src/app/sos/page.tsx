"use client";

import React from 'react';
import SOSSection from '../../components/SOSSection';

export default function SOSPage() {
  return (
    <main className="min-h-screen bg-primary-bg">
      <div className="bg-secondary-bg p-4 fixed top-0 w-full z-10">
        <h1 className="text-xl font-bold">UG Campus Hub - SOS Resources</h1>
      </div>
      
      <div className="pt-20 px-4">
        <SOSSection />
      </div>
      
      <footer className="bg-secondary-bg border-t border-accent-30 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-text-secondary">
          <p>© {new Date().getFullYear()} UG - The Underground Campus Hub</p>
        </div>
      </footer>
    </main>
  );
}
