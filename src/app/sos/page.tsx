"use client";

import React from 'react';
import Header from '../../../components/Header';
import SOSSection from '../../../components/SOSSection';

export default function SOSPage() {
  return (
    <main className="min-h-screen bg-primary-bg">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-10">
        <SOSSection />
      </div>
      
      <footer className="bg-secondary-bg border-t border-accent-30 py-4">
        <div className="container mx-auto px-4 text-center text-text-secondary">
          <p>© {new Date().getFullYear()} UG - The Underground Campus Hub</p>
        </div>
      </footer>
    </main>
  );
}
