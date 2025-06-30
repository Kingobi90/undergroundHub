"use client";

import React from 'react';

export default function SOSPage() {
  return (
    <main className="min-h-screen bg-primary-bg">
      <div className="pt-20 p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Campus SOS</h1>
        <p>SOS services are temporarily unavailable. Please check back later.</p>
      </div>
      
      <footer className="bg-secondary-bg border-t border-accent-30 py-4">
        <div className="container mx-auto px-4 text-center text-text-secondary">
          <p>© {new Date().getFullYear()} UG - The Underground Campus Hub</p>
        </div>
      </footer>
    </main>
  );
}
