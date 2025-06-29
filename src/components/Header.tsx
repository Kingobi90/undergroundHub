"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-primary-bg border-b border-accent z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-accent flex items-center gap-1">
          <div className="relative w-10 h-10 overflow-hidden">
            <Image 
              src="/images/stingers_logo_transparent_cropped.png" 
              alt="Stingers logo" 
              width={40} 
              height={40} 
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/feed" className="nav-link">Live Feed</Link>
          <Link href="/sos" className="nav-link text-accent font-semibold">SOS</Link>
          <Link href="/spotted" className="nav-link">Spotted</Link>
          <Link href="/events" className="nav-link">Events</Link>
          <Link href="/polls" className="nav-link">Polls</Link>
        </nav>

        {/* Submit Button */}
        <button className="hidden md:block btn btn-primary">Submit</button>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-accent focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-bg border-b border-accent-50">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="/feed" className="nav-link block py-2">Live Feed</Link>
            <Link href="/sos" className="nav-link block py-2 text-accent font-semibold">SOS</Link>
            <Link href="/spotted" className="nav-link block py-2">Spotted</Link>
            <Link href="/events" className="nav-link block py-2">Events</Link>
            <Link href="/polls" className="nav-link block py-2">Polls</Link>
            <button className="btn btn-primary w-full mt-4">Submit</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
